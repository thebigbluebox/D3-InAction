/*var yScale = d3.scaleLinear() .domain([0,100,1000,24500]).range([0,50,75,100]);
console.log(yScale(14));
console.log(yScale(68));
console.log(yScale(24500));
console.log(yScale(430));
console.log(yScale(19));
console.log(yScale(1000));
console.log(yScale(5555));
d3.select("svg")
.selectAll("rect")
.data([14, 68, 24500, 430, 19, 1000, 5555])
.enter()
.append("rect")
.attr("width", 10)
.attr("height", function(d) {return yScale(d);})
.style("fill", "blue")
.style("stroke", "red")
.style("stroke-width", "1px")
.style("opacity", 0.25)
.attr("x", function(d,i) {return i * 10;})
.attr("y", function(d) {return 100 - yScale(d);});*/

//Chapter 2
//d3.csv("./data/cities.csv",  function(error,data){dataViz(data);});
// Why doesn't this graph render, probably because D3 functions has changed
// Lol because I didn't read the data and realize it was all in decimals of millions
/*function dataViz(incomingData){
  var maxPopulation = d3.max(incomingData, function(el) {
    return parseFloat(el.population);}
  );
  var yScale = d3.scaleLinear().domain([0,maxPopulation]).range([0,100]);
  d3.select("svg").attr("style","height: 100px; width: 600px;");
  d3.select("svg")
  .selectAll("rect")
  .data(incomingData)
  .enter()
  .append("rect")
  .attr("width", 50)
  .attr("height", function(d) {return yScale(parseFloat(d.population));})
  .attr("x", function(d,i) {return i * 60;})
  .attr("y", function(d) {return 100 - yScale(parseFloat(d.population));})
  .style("fill", "blue")
  .style("stroke", "red")
  .style("stroke-width", "1px")
  .style("opacity", .25);
}*/

//Tweeter Analytics
/*d3.json("./data/tweets.json", function(error,data){dataViz(data.tweets)});
function dataViz(incomingData){
  console.log(incomingData);
  var nestedTweets = d3.nest()
  .key(function(el){return el.user;})
  .entries(incomingData);
  
  nestedTweets.forEach(function (el) {
    el.numTweets = el.values.length;
  })
  
  var maxTweets = d3.max(nestedTweets, function(el) {return el.numTweets;});
  var yScale = d3.scaleLinear().domain([0,maxTweets]).range([0,100]);
  d3.select("svg").attr("style","height: 480px; width: 600px;");
  d3.select("svg")
    .selectAll("rect")
    .data(nestedTweets)
    .enter()
    .append("rect")
    .attr("width", 50)
    .attr("height", function(d) {return yScale(d.numTweets);})
    .attr("x", function(d,i) {return i * 60;})
    .attr("y", function(d) {return 100 - yScale(d.numTweets);})
    .style("fill", "blue")
    .style("stroke", "red")
    .style("stroke-width", "1px").style("opacity", .25);
 
}*/

//Tweeter scatter plot
d3.json("./data/tweets.json", function(error,data){
  dataViz(data.tweets);
});

function dataViz(incomingData) {
  incomingData.forEach(function (el) {
    el.impact = el.favorites.length + el.retweets.length;
    el.tweetTime = new Date(el.timestamp);
  })

  var maxImpact = d3.max(incomingData, function(el) {return el.impact;});
  var startEnd = d3.extent(incomingData, function(el) {
  return el.tweetTime;
  });

  var timeRamp = d3.scaleTime().domain(startEnd).range([20,480]);
  var yScale = d3.scaleLinear().domain([0,maxImpact]).range([0,460]);
  var radiusScale = d3.scaleLinear()
  .domain([0,maxImpact]).range([1,20]);
  var colorScale = d3.scaleLinear()
  .domain([0,maxImpact]).range(["white","#990000"]);
  d3.select("svg").attr("style","height: 480px; width: 600px;");
  d3.select("svg")
    .selectAll("circle")
    .data(incomingData, function(d) { return JSON.stringify(d)})
    .enter()
    .append("circle")
    .attr("r", function(d) {return radiusScale(d.impact);})
    .attr("cx", function(d,i) {return timeRamp(d.tweetTime);})
    .attr("cy", function(d) {return 480 - yScale(d.impact);})
    .style("fill", function(d) {return colorScale(d.impact);})
    .style("stroke", "black")
    .style("stroke-width", "1px");
  
  var tweetG = d3.select("svg")
  .selectAll("g")
  .data(incomingData)
  .enter()
  .append("g")
  .attr("transform", function(d) {
  //sets the attribute of transform to equal the position of thecircles
  return "translate(" +
    timeRamp(d.tweetTime) + "," + (480 - yScale(d.impact))
+ ")"; })
  
  //for increased readbility
/*  tweetG.append("circle")
  .attr("r", function(d) {return radiusScale(d.impact);})
  .style("fill", "#990000")
  .style("stroke", "black")
  .style("stroke-width", "1px");*/
  
  tweetG.append("text")
  .text(function(d) {return d.user + "-" + d.tweetTime.getHours();});
  
  var filteredData = incomingData.filter(function(el) {return el.impact > 0});
  d3.selectAll("circle")
    .data(filteredData, function(d) {return JSON.stringify(d)})
    .exit()
    .remove();
  
  d3.selectAll("g").data([1,2,3,4]).exit().remove();
  
  d3.selectAll("g").select("text").text(function(d) {return d})
};


