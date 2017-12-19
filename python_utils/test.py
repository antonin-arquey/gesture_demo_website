import tensorflow as tf

# Load the VGG-16 model in the default graph
g_saver = tf.train.import_meta_graph('./final_model_5/best_model.meta')
# Access the graph
g_graph = tf.get_default_graph()
for op in tf.get_default_graph().get_operations():
    print(op.values())
print(g_graph)

x = g_graph.get_tensor_by_name('conv1c1:0')

saver = tf.train.Saver()
with tf.Session() as sess:
  saver.restore(sess=sess, save_path='final_model_5/best_model')
  sess.run(tf.get_variable('conv1a:0'))
  print(tf.get_collection(tf.GraphKeys.GLOBAL_VARIABLES))
  print(tf.get_variable('Variable:0'))


#print(tf.trainable_variables())
