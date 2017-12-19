import tensorflow as tf
import numpy as np
import os
import ctypes
import time
import json

def new_weights_conv(name,shape):
    return tf.get_variable(name, shape=shape, dtype=tf.float32,
           initializer=tf.contrib.layers.xavier_initializer_conv2d())

def new_weights_fc(name,shape):
    return tf.get_variable(name, shape=shape, dtype=tf.float32,
           initializer=tf.contrib.layers.xavier_initializer())

def new_biases(length):
    return tf.Variable(tf.constant(0.05, shape=[length], dtype=tf.float32), dtype=tf.float32)

def new_conv_layer(name,input,              # The previous layer.
                   num_input_channels, # Num. channels in prev. layer.
                   filter_size,        # Width and height of each filter.
                   num_filters,        # Number of filters.
                   dropout,            # Dropout rate
                   use_pooling=True):  # Use 2x2 max-pooling.

    shape = [filter_size, filter_size, num_input_channels, num_filters]

    # Create new weights aka. filters with the given shape.
    weights = new_weights_conv(name,shape)

    # Create new biases, one for each filter.
    biases = new_biases(length=num_filters)
    layer = tf.nn.conv2d(input=input,
                         filter=weights,
                         strides=[1, 1, 1, 1],
                         padding='SAME')

    layer += biases

    # Use pooling to down-sample the image resolution?
    if use_pooling:
        layer = tf.nn.max_pool(value=layer,
                               ksize=[1, 2, 2, 1],
                               strides=[1, 2, 2, 1],
                               padding='SAME')
    layer = tf.nn.relu(layer)
    return layer, weights, biases

def flatten_layer(layer):
    # Get the shape of the input layer.
    layer_shape = layer.get_shape()
    num_features = layer_shape[1:4].num_elements()
    layer_flat = tf.reshape(layer, [-1, num_features])
    return layer_flat, num_features


def new_fc_layer(name,input,          # The previous layer.
                 num_inputs,     # Num. inputs from prev. layer.
                 num_outputs, use_nonlinear):
    weights = new_weights_fc(name,[num_inputs, num_outputs])
    biases = new_biases(length=num_outputs)

    layer = tf.matmul(input, weights) + biases
    if use_nonlinear:
      layer = tf.nn.relu(layer)

    return layer, weights, biases


# Convolutional Layer 1.
filter_size1 = 3
num_filters1 = 32
num_filters2 = 64
num_filters3 = 128

n_images = 1
n_classes = 6
batch_size = 256
imgSize = 64

x = tf.placeholder(tf.float32, [None, imgSize, imgSize, n_images])
x_image = tf.reshape(x, [-1, imgSize, imgSize, n_images])
y = tf.placeholder(tf.float32)
keep_prob = tf.placeholder(tf.float32)

layer_conv1a, weights_conv1a, biases1a = \
    new_conv_layer("conv1a",input=x_image,
                   num_input_channels=n_images,
                   filter_size=filter_size1,
                   num_filters=num_filters1,
                   dropout=keep_prob,
                   use_pooling=False)

layer_conv1a1, weights_conv1a1, biases1a1 = \
    new_conv_layer("conv1a1",input=layer_conv1a,
                   num_input_channels=num_filters1,
                   filter_size=filter_size1,
                   num_filters=num_filters1,
                   dropout=keep_prob,
                   use_pooling=True)

layer_conv1b, weights_conv1b, biases1b = \
    new_conv_layer("conv1b",input=layer_conv1a1,
                   num_input_channels=num_filters1,
                   filter_size=filter_size1,
                   num_filters=num_filters1,
                   dropout=keep_prob,
                   use_pooling=False)

layer_conv1b1, weights_conv1b1, biases1b1 = \
    new_conv_layer("conv1b1",input=layer_conv1b,
                   num_input_channels=num_filters1,
                   filter_size=filter_size1,
                   num_filters=num_filters1,
                   dropout=keep_prob,
                   use_pooling=True)

layer_conv1c, weights_conv1c, biases1c = \
    new_conv_layer("conv1c",input=layer_conv1b1,
                   num_input_channels=num_filters1,
                   filter_size=filter_size1,
                   num_filters=num_filters1,
                   dropout=keep_prob,
                   use_pooling=False)

layer_conv1c1, weights_conv1c1, biases1c1 = \
    new_conv_layer("conv1c1",input=layer_conv1c,
                   num_input_channels=num_filters1,
                   filter_size=filter_size1,
                   num_filters=num_filters1,
                   dropout=keep_prob,
                   use_pooling=True)

layer_flat, num_features = flatten_layer(layer_conv1c1)

layer_f, weights_f, biases_f = new_fc_layer("fc",input=layer_flat,
                         num_inputs=num_features,
                         num_outputs=n_classes,
                         use_nonlinear=False)

y_pred = tf.nn.softmax(layer_f)
y_pred_cls = tf.argmax(y_pred, dimension=1)

print(layer_conv1a)
print(layer_flat)
print(layer_f)

correct = tf.equal(tf.argmax(layer_f, 1), tf.argmax(y, 1))
accuracy = tf.reduce_mean(tf.cast(correct, 'float'))

saver = tf.train.Saver()
save_dir = 'final_model/'
if not os.path.exists(save_dir):
    os.makedirs(save_dir)
save_path = os.path.join(save_dir, 'best_model')


gestures = ['Swuping Left', 'Swiping Right', 'Swiping Down', \
            'Swiping Up', 'Doing other things']

t = time.time()
with tf.Session() as sess:
  sess.run(tf.global_variables_initializer())
  saver.restore(sess=sess, save_path=save_path)

  conv1a = sess.run([weights_conv1a, biases1a])
  conv1a1 = sess.run([weights_conv1a1, biases1a1])
  conv1b = sess.run([weights_conv1b, biases1b])
  conv1b1 = sess.run([weights_conv1b1, biases1b1])
  conv1c = sess.run([weights_conv1c, biases1c])
  conv1c1 = sess.run([weights_conv1c1, biases1c1])
  fc = sess.run([weights_f, biases_f])
  print(conv1a[0].shape, conv1a[1].shape)

def addRelu(conv, size):
  filtersSize = conv[0].shape
  return {
      "out_depth": filtersSize[3],
      "out_sx": size[0],
      "out_sy": size[1],
      "layer_type": "relu"
    }

def addPool(conv,size):
  filtersSize = conv[0].shape
  return {
      "sx": 2,
      "sy": 2,
      "stride": 2,
      "in_depth": filtersSize[3],
      "out_depth": filtersSize[3],
      "out_sx": size[0],
      "out_sy": size[1],
      "layer_type": "pool",
      "pad": 0
    }

def addwfc(flatten, index):
    w = []
    for y in range(len(flatten)):
        w.append(flatten[y][index])
    return w

def addw(flatten):
  w = []
  for y in range(len(flatten)):
      w.append(flatten[y])
  return w

def addB(biases):
  b = []
  for x in range(len(biases)):
    b.append(biases[x])
  return b

def addFiltersConv(conv):
  filtersSize = conv.shape
  flatten = np.transpose(conv, (3, 0, 1, 2)).reshape((filtersSize[3],filtersSize[0]*filtersSize[1]*filtersSize[2]))
  return [{
            "sx": filtersSize[0],
            "sy": filtersSize[1],
            "depth": filtersSize[2],
            "w": addw(flatten[x])
  } for x in range(filtersSize[3])]

def addBiases(conv):
  return {
          "depth": len(conv),
          "sx": 1,
          "sy": 1,
          "w": addB(conv)
  }

def addinput(n,size):
  return {
          "out_depth": n,
          "out_sx": size[0],
          "out_sy": size[1],
          "layer_type": "input"
          }

def addConv(conv, size):
  filtersSize = conv[0].shape
  return {
          "sx": filtersSize[0],
          "sy": filtersSize[1],
          "stride": 1,
          "in_depth": filtersSize[2],
          "out_depth": filtersSize[3],
          "out_sx": size[0],
          "out_sy": size[1],
          "layer_type": "conv",
          "l1_decay_mul":0,"l2_decay_mul":1,"pad":1,
          "filters": addFiltersConv(conv[0]),
          "biases": addBiases(conv[1])
          }

def addFilters(fc):
  return [{
            "sx": 1,
            "sy": 1,
            "depth": len(fc),
            "w": addwfc(fc, x)
  } for x in range(len(fc[0]))]

def addfc(fc):
  return {
          "out_depth": 6,
          "out_sx": 1,
          "out_sy": 1,
          "layer_type": "fc",
          "num_inputs": 2048,
          "l1_decay_mul": 0,
          "l2_decay_mul": 1,
          "filters": addFilters(fc[0]),
          "biases": addBiases(fc[1])
  }

def softmax(n):
  return {
          "out_depth": n,
          "out_sx": 1,
          "out_sy": 1,
          "layer_type": "softmax",
          "num_inputs": n
  }

layers = []
layers.append(addinput(1,[64,64]))
layers.append(addConv(conv1a,[64,64]))
layers.append(addRelu(conv1a,[64,64]))

layers.append(addConv(conv1a1,[64,64]))
layers.append(addRelu(conv1a1,[64,64]))
layers.append(addPool(conv1a1,[32,32]))

layers.append(addConv(conv1b,[32,32]))
layers.append(addRelu(conv1b,[32,32]))

layers.append(addConv(conv1b1,[32,32]))
layers.append(addRelu(conv1b1,[32,32]))
layers.append(addPool(conv1b1,[16,16]))

layers.append(addConv(conv1c,[16,16]))
layers.append(addRelu(conv1c,[16,16]))

layers.append(addConv(conv1c1,[16,16]))
layers.append(addRelu(conv1c1,[16,16]))
layers.append(addPool(conv1c1,[8,8]))

layers.append(addfc(fc))
layers.append(softmax(n_classes))
print(layers)
model_json = {'layers': layers}
f = open('model.json', 'w')

model_json = str(model_json)
model_json = model_json.replace("'","\"")


f.write(str(model_json))
f.close()
