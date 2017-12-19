layer_defs = [];
layer_defs.push({type:'input', out_sx:64, out_sy:64, out_depth:5});
layer_defs.push({type:'conv', sx:3, filters:32, stride:1, pad:1, activation:'relu'});
layer_defs.push({type:'conv', sx:3, filters:32, stride:1, pad:1, activation:'relu'});
layer_defs.push({type:'pool', sx:2, stride:2});
layer_defs.push({type:'conv', sx:3, filters:32, stride:1, pad:1, activation:'relu'});
layer_defs.push({type:'conv', sx:3, filters:32, stride:1, pad:1, activation:'relu'});
layer_defs.push({type:'pool', sx:2, stride:2});
layer_defs.push({type:'conv', sx:3, filters:32, stride:1, pad:1, activation:'relu'});
layer_defs.push({type:'conv', sx:3, filters:32, stride:1, pad:1, activation:'relu'});
layer_defs.push({type:'pool', sx:2, stride:2});
//layer_defs.push({type:'fc', num_inputs:2048, out_sx:1, out_sy:1, out_depth:5});
layer_defs.push({type:'softmax', num_classes:5});
 
// create a net out of it
var net = new convnetjs.Net();
net.makeLayers(layer_defs);
 
// the network always works on Vol() elements. These are essentially
// simple wrappers around lists, but also contain gradients and dimensions
// line below will create a 1x1x2 volume and fill it with 0.5 and -1.3
let arr = [[]];
let x = 0;
for (var i = 0; i < 64*64*3; i += 4) {
	if (i%256 == 0){
	  arr.push([]);
	}
	var val = Math.random();
	arr[x].push([val, val, val, val, val]);
}
var v = new convnetjs.Vol(arr);
 
var probability_volume = net.forward(v);
console.log(probability_volume);
// prints 0.50101
var json = net.toJSON();
console.log(json);