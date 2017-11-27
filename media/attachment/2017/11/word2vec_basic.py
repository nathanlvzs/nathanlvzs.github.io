# encoding=utf-8

"""Basic word2vec example."""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import collections
import math
import os
import random
from tempfile import gettempdir
import zipfile

import numpy as np
from six.moves import urllib
from six.moves import xrange  # pylint: disable=redefined-builtin
import tensorflow as tf

# 步骤1：下载准备数据
url = 'http://mattmahoney.net/dc/'

# pylint: disable=redefined-outer-name
def maybe_download(filename, expected_bytes):
    """Download a file if not present, and make sure it's the right size."""
    # 在临时目录下寻找数据集文件，如果没有则联网下载，并对文件做大小验证
    local_filename = os.path.join(gettempdir(), filename)
    # 改：换成当前目录
    local_filename = filename
    if not os.path.exists(local_filename):
        local_filename, _ = urllib.request.urlretrieve(url + filename,
                                                       local_filename)
    statinfo = os.stat(local_filename)
    if statinfo.st_size == expected_bytes:
        print('Found and verified', filename)
    else:
        print(statinfo.st_size)
        raise Exception('Failed to verify ' + local_filename +
                        '. Can you get to it with a browser?')
    return local_filename


# 从zip包中读取数据，返回字符串列表
def read_data(filename):
    """Extract the first file enclosed in a zip file as a list of words."""
    # 读取数据集压缩包文件中第一个文件的内容，返回单词列表
    # https://www.tensorflow.org/api_docs/python/tf/compat/as_str_any
    with zipfile.ZipFile(filename) as f:
        data = tf.compat.as_str(f.read(f.namelist()[0])).split()
    return data


filename = maybe_download('text8.zip', 31344016)
vocabulary = read_data(filename)
# Data size 17005207
print('Data size', len(vocabulary))

# Step 2: 构建词典，将罕见字替换成UNK
# 限制词典大小为50000
vocabulary_size = 50000


def build_dataset(words, n_words):
    """Process raw inputs into a dataset."""
    # 构建数据集
    # 返回四个元素：编号表示的文本，词典中词及其频次结果列表，词到编号的映射字典，编号到词的映射字典
    count = [['UNK', -1]]  # UNK这里的内容之所以是列表，是因为后面要更改它的频次
    # 统计文本数据中的词频，将出现频次在前n_words-1的字和其字频添加到count列表中
    count.extend(collections.Counter(words).most_common(n_words - 1))
    # 按照count列表中的顺序，给每个字编号
    dictionary = dict()
    for word, _ in count:
        dictionary[word] = len(dictionary)
    # 将文本转换成编号表示
    data = list()
    unk_count = 0  # 统计文本数据中出现了多少次那些要被替换成UNK的词
    for word in words:
        index = dictionary.get(word, 0)
        if index == 0:  # dictionary['UNK']
            unk_count += 1
        data.append(index)
    count[0][1] = unk_count  # 更新UNK的频次
    reversed_dictionary = dict(zip(dictionary.values(), dictionary.keys()))
    return data, count, dictionary, reversed_dictionary

# Filling 4 global variables:
# data - list of codes (integers from 0 to vocabulary_size-1).
#   This is the original text but words are replaced by their codes
# count - map of words(strings) to count of occurrences
# dictionary - map of words(strings) to their codes(integers)
# reverse_dictionary - maps codes(integers) to words(strings)
data, count, dictionary, reverse_dictionary = build_dataset(vocabulary,
                                                            vocabulary_size)
del vocabulary  # Hint to reduce memory.
print('Most common words (+UNK)', count[:5])
print('Sample data', data[:10], [reverse_dictionary[i] for i in data[:10]])

data_index = 0

# Step 3: Function to generate a training batch for the skip-gram model.
def generate_batch(batch_size, num_skips, skip_window):
    # batch_size 一个batch包含多少个样本，须是num_skips的整数倍
    # num_skips 一个目标词要预测多少次上下文词语，用于采样
    # skip_window 目标词一边窗口的大小，比如为2的话，表示要根据目标词预测上文2个词、下文2个词
    # 生成batch，
    global data_index
    assert batch_size % num_skips == 0
    assert num_skips <= 2 * skip_window
    batch = np.ndarray(shape=(batch_size), dtype=np.int32)  # 每个样本的x为目标词本身
    labels = np.ndarray(shape=(batch_size, 1), dtype=np.int32)  # 每个样本的y为目标词窗口中的一个词
    span = 2 * skip_window + 1  # [ skip_window target skip_window ]
    # 定长的buffer
    buffer = collections.deque(maxlen=span)
    if data_index + span > len(data):  # 不足一个span，将data_index复位
        data_index = 0
    # 将一个span的数据放入buffer中
    buffer.extend(data[data_index:data_index + span])
    data_index += span
    # batch//num_skips 为一个batch中要包含目标词的数量
    for i in range(batch_size // num_skips):
        # 上下文词语的位置索引
        context_words = [w for w in range(span) if w != skip_window]
        # 从context_words中采样num_skips次
        words_to_use = random.sample(context_words, num_skips)
        for j, context_word in enumerate(words_to_use):
            batch[i * num_skips + j] = buffer[skip_window]
            labels[i * num_skips + j, 0] = buffer[context_word]
        # 更新data_index和buffer
        if data_index == len(data):
            buffer[:] = data[:span]
            data_index = span
        else:
            # 加入一项，相当于buffer窗口往右滑一下
            buffer.append(data[data_index])
            data_index += 1
    # Backtrack a little bit to avoid skipping words in the end of a batch
    data_index = (data_index + len(data) - span) % len(data)
    return batch, labels


batch, labels = generate_batch(batch_size=8, num_skips=2, skip_window=1)
# 打印batch和labels中的部分内容
for i in range(8):
    print(batch[i], reverse_dictionary[batch[i]],
          '->', labels[i, 0], reverse_dictionary[labels[i, 0]])

# Step 4: Build and train a skip-gram model.
# 构建训练skip-gram模型

batch_size = 128
embedding_size = 128  # Dimension of the embedding vector.
skip_window = 1  # How many words to consider left and right.
num_skips = 2  # How many times to reuse an input to generate a label.
num_sampled = 64  # Number of negative examples to sample.

# 挑一些数据出来用于绘图展示
# We pick a random validation set to sample nearest neighbors. Here we limit the
# validation samples to the words that have a low numeric ID, which by
# construction are also the most frequent. These 3 variables are used only for
# displaying model accuracy, they don't affect calculation.
valid_size = 16  # Random set of words to evaluate similarity on.
valid_window = 100  # Only pick dev samples in the head of the distribution.
valid_examples = np.random.choice(valid_window, valid_size, replace=False)

graph = tf.Graph()

with graph.as_default():
    # Input data.
    train_inputs = tf.placeholder(tf.int32, shape=[batch_size])
    train_labels = tf.placeholder(tf.int32, shape=[batch_size, 1])
    valid_dataset = tf.constant(valid_examples, dtype=tf.int32)

    # Ops and variables pinned to the CPU because of missing GPU implementation
    with tf.device('/cpu:0'):
        # embedding层
        # Look up embeddings for inputs.
        embeddings = tf.Variable(
            tf.random_uniform([vocabulary_size, embedding_size], -1.0, 1.0))
        embed = tf.nn.embedding_lookup(embeddings, train_inputs)

        # Construct the variables for the NCE loss
        # 为noise contrastive estimation loss构造相关参数容器
        # 权重矩阵，维度 词典大小×词向量大小，正态分布初始化
        nce_weights = tf.Variable(
            tf.truncated_normal([vocabulary_size, embedding_size],
                                stddev=1.0 / math.sqrt(embedding_size)))
        # 偏置向量，维度：词典大小
        nce_biases = tf.Variable(tf.zeros([vocabulary_size]))

    # 计算一个batch的平均NCE损失
    # Compute the average NCE loss for the batch.
    # tf.nce_loss automatically draws a new sample of the negative labels each
    # time we evaluate the loss.
    # Explanation of the meaning of NCE loss:
    #   http://mccormickml.com/2016/04/19/word2vec-tutorial-the-skip-gram-model/
    loss = tf.reduce_mean(
        tf.nn.nce_loss(weights=nce_weights,
                       biases=nce_biases,
                       labels=train_labels,
                       inputs=embed,
                       num_sampled=num_sampled,  # 负采样的次数
                       num_classes=vocabulary_size))
    # 随机梯度下降优化器，学习率1.0
    # Construct the SGD optimizer using a learning rate of 1.0.
    optimizer = tf.train.GradientDescentOptimizer(1.0).minimize(loss)

    # Compute the cosine similarity between minibatch examples and all embeddings.
    # 使embedding中每个词向量的norm都为1
    norm = tf.sqrt(tf.reduce_sum(tf.square(embeddings), 1, keep_dims=True))
    normalized_embeddings = embeddings / norm

    valid_embeddings = tf.nn.embedding_lookup(
        normalized_embeddings, valid_dataset)
    # 求挑选出的词向量跟全部词向量的cosine距离
    similarity = tf.matmul(
        valid_embeddings, normalized_embeddings, transpose_b=True)

    # Add variable initializer.
    init = tf.global_variables_initializer()

# Step 5: Begin training.
# 迭代训练
num_steps = 100001

with tf.Session(graph=graph) as session:
    # We must initialize all variables before we use them.
    # 初始化计算图中的所有变量
    init.run()
    print('Initialized')

    average_loss = 0
    for step in xrange(num_steps):
        batch_inputs, batch_labels = generate_batch(
            batch_size, num_skips, skip_window)
        feed_dict = {train_inputs: batch_inputs, train_labels: batch_labels}

        # We perform one update step by evaluating the optimizer op (including it
        # in the list of returned values for session.run()
        _, loss_val = session.run([optimizer, loss], feed_dict=feed_dict)
        average_loss += loss_val

        # 每2000个batch处理后打印平均loss
        if step % 2000 == 0:
            if step > 0:
                average_loss /= 2000
            # The average loss is an estimate of the loss over the last 2000 batches.
            print('Average loss at step ', step, ': ', average_loss)
            average_loss = 0

        # Note that this is expensive (~20% slowdown if computed every 500 steps)
        # 每10000个batch处理后，打印看看一些词的k近邻
        if step % 10000 == 0:
            sim = similarity.eval()
            for i in xrange(valid_size):
                valid_word = reverse_dictionary[valid_examples[i]]
                top_k = 8  # number of nearest neighbors
                nearest = (-sim[i, :]).argsort()[1:top_k + 1]
                log_str = 'Nearest to %s:' % valid_word
                for k in xrange(top_k):
                    close_word = reverse_dictionary[nearest[k]]
                    log_str = '%s %s,' % (log_str, close_word)
                print(log_str)
    # 得到最终的词向量结果
    final_embeddings = normalized_embeddings.eval()

# Step 6: Visualize the embeddings.
# 可视化

# pylint: disable=missing-docstring
# Function to draw visualization of distance between embeddings.
def plot_with_labels(low_dim_embs, labels, filename):
    assert low_dim_embs.shape[0] >= len(labels), 'More labels than embeddings'
    plt.figure(figsize=(18, 18))  # in inches
    for i, label in enumerate(labels):
        x, y = low_dim_embs[i, :]
        plt.scatter(x, y)
        plt.annotate(label,
                     xy=(x, y),
                     xytext=(5, 2),
                     textcoords='offset points',
                     ha='right',
                     va='bottom')

    plt.savefig(filename)

try:
    # pylint: disable=g-import-not-at-top
    from sklearn.manifold import TSNE
    import matplotlib.pyplot as plt

    tsne = TSNE(perplexity=30, n_components=2, init='pca', n_iter=5000, method='exact')
    plot_only = 500
    low_dim_embs = tsne.fit_transform(final_embeddings[:plot_only, :])
    labels = [reverse_dictionary[i] for i in xrange(plot_only)]
    # plot_with_labels(low_dim_embs, labels, os.path.join(gettempdir(), 'tsne.png'))
    # 改到当前目录
    plot_with_labels(low_dim_embs, labels, 'tsne.png')

except ImportError as ex:
    print('Please install sklearn, matplotlib, and scipy to show embeddings.')
    print(ex)
