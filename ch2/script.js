var flags = {
    Netherlands: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg',
    Spain: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg',
    Germany: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg',
    Argentina: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg',
    Uruguay: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Uruguay.svg',
    Brazil: 'https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg',
    Ghana: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Flag_of_Ghana.svg',
    Japan: 'https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg'
}

function createSoccerViz() {
    // Getting the data from a csv from this github user, and D3 converts it into a row object
    d3.csv('https://raw.githubusercontent.com/aidken/learning_d3js/master/worldcup.csv', function (data) {
		/** 
		 * The function to actually create the visualization
		*/
        overallTeamViz(data);
    });

	/**
	 * This will generate the D3 chart and attach all the listeners as well
	 * @param {*} incomingData the D3 converted data
	 */
    function overallTeamViz(incomingData) {
        // We will define these immediate colors for our color scheme
        teamColor = d3.rgb('red');
        teamColor = d3.rgb('#ff0000');
        teamColor = d3.rgb('rgb(255,0,0)');
        teamColor = d3.rgb(255, 0, 0);

		/** Lets start off by creating this D3 canvas that will plot our master piece
		* So we created a new group with id of teamsG
		* We translate that group to the teamsG
		* select that group that we have created, then we now bind .data(incomingData)
		* We now enter this function to perform per data point operations
		* For each of the incomingData node, we append a new group with class overallG
		* Then depending on the index of the node we translate it 50pixels to the right
		*/

        d3
            .select('svg')
            .append('g')
            .attr('id', 'teamsG')
            .attr('transform', 'translate(50,300)')
            .selectAll('g')
            .data(incomingData)
            .enter()
            .append('g')
            .attr('class', 'overallG')
            .attr('transform', function (d, i) {
                return 'translate(' + i * 50 + ', 0)';
            });

        // Now that we created the d3 teamsG, we now have a group of teamsG we can get all of those elements
        var teamG = d3.selectAll('g.overallG');

		/** Introduction animation
		* Now we will attach circles to each of the data points to start off the animation
		* We append the circle element, with a radius of 0 in the beginning
		* Then we start the transition() and delay each transition by a factor depending on its index*100 milliseconds
		* Set the duration to 500 milliseconds and set the resulting radius to be 40 pixels at its max
		* Then we start another transition to get the radius back down to 20 pixels
		*/
        teamG
            .append('circle')
            .attr('r', 0)
            .transition()
            .delay(function (d, i) {
                return i * 100;
            })
            .duration(500)
            .attr('r', 40)
            .transition()
            .duration(500)
            .attr('r', 20);

		/** Now we will be appending text to each of the circle teamG
		 * We first append the text element
		 * Add a style in where the text-anchor will be [middle]
		 * Translate it essentially 30 pixels in the Y axis down (remenber in svg the 0,0 is at top left and 1,1 is bottom right)
		 * Add the style for font-size setting it at 10px
		*/

        teamG.append('text').style('text-anchor', 'middle').attr('y', 30).style('font-size', '10px').text(function (d) {
            return d.team;
        });

		/**
		 * This is to just show that d3 actually binds the data to each of those circle elements, which also shows you the index
		 * as well
		 */
        d3.select('circle').each(function (d, i) {
            // This is the data
            console.log(d);
            // This is the index
            console.log(i);
            // The actual element so you can just use the current element
            console.log(this);
        });

		/**
		 * We will add a new image over each of the elements in the circles
         * By appending the <images> tag to the circle
		 */
        d3
            .selectAll('g.overallG')
            .insert('image', 'text')
            .attr('xlink:href', function (d) {
                return flags[d.team];
            })
            .attr('width', '30px')
            .attr('height', '20px')
            .attr('x', '-15')
            .attr('y', '-10');


        /**
         * We assign the resource/modal.html as a binding to be added to the graph
        */
        d3.text("./resources/modal.html", function (data) {
            d3.select("body").append("div").attr("id", "modal").html(data);
        });

        // Now we assign on the click of any circle we include the team click
        teamG.on("click", teamClick);

        /**
         * From the click we will show the values to the modal
         * All of the data will be bound to the td's with the class "data"
         * And .data will enter the values of d3.values(d)
         * 
         * And for each element of td.data we will enter the data in the HTML
         * @param {d3Object} d 
         */
        function teamClick(d) {
            d3.selectAll("td.data").data(d3.values(d))
                .html(function (p) {
                    console.log("team clicked data", p);
                    return p
                });
        }

		/**
		 * Depending on the current state of the mouse, which can be over the circle elements teamG
		 * We will execute when a mouse goes over the circles
		 * We then execute the highlightRegion2 function
		 */
        teamG.on('mouseover', highlightRegion2);

		/**
		 * HighLight Region, takes in the d as in data which is what D3 by default will enter into a function
		 * Adding a second input parameter we get the index of the element
		 * The from the data, we will color all the circles d3.selectAll and compare it to the one that is being passed through d
		 * If they match D's region, it will be colored red, else gray
		 * @param {*} d Data
		 */
        function highlightRegion(d) {
            d3.selectAll('g.overallG').select('circle').style('fill', function (p) {
                return p.region == d.region ? 'red' : 'gray';
            });
        }

		/**
         * This lets us highlight the region based off the color like highlightRegion(d)
         * @param d Data
         * @param i Index
         */
        function highlightRegion2(d, i) {
            // Now we use the rgb that we defined
            var teamColor = d3.rgb('pink');
            // Move the text up like we said into the circle when hovering over the element move the text into the circle, and make the text larger
            // This also adds the highlight class to the element as well
            d3.select(this).select('text').classed('highlight', true).attr('y', 10).style('font-size', '30px');
            // Now we color it like before and according to the D3.rgb that we have defined
            d3.selectAll('g.overallG').select('circle').style('fill', function (p) {
                return p.region == d.region ? teamColor.darker(0.75) : teamColor.brighter(0.5);
            });
            //This actually re appends this child back to the parent so that the next will show up on top instead of behind the elements
            // of any element above it
            this.parentElement.appendChild(this);
        }

		/**
		 * On mouse out we will reset the color scheme back to what it was before, first iteration
		 */
        // teamG.on("mouseout", function() {
        // 	d3.selectAll("g.overallG").select("circle").style("fill", "pink");
        // });

		/**
		 * Now we will define the teamG behaviour on mouseout with the function unHighlight
		 */
        teamG.on('mouseout', unHighlight);

		/** 
		 * This function will reset the elements back to the original state
		*/
        function unHighlight() {
            // We will remove that hilighted class that we just defined in the highlighted function
            d3.selectAll('g.overallG').select('circle').attr('class', '');
            // Reset the elements back to the text size
            d3
                .selectAll('g.overallG')
                .select('text')
                .classed('highlight', false)
                .attr('y', 30)
                .style('font-size', '10px');
            //Disables the pointer events for the text label which is part of the G
            // So disable below, and hover over where the title is, and see it flickers
            teamG.select('text').style('pointer-events', 'none');
        }

		/**
		 * We will now get all the keys from the data and get all the label so that we can
		 * label the buttons below. So from the first data, we will perform a filter and get all the keys
		 * however team and region are none numerical data so we will exlude those pieces of the data
		 */
        var dataKeys = d3.keys(incomingData[0]).filter(function (el) {
            return el != 'team' && el != 'region';
        });

        // We create a button for each of the dataKeys that we have found
        // HTML function actually attach a function where it returns the name of its element
        // .html will can actually enter raw html in the element
        // but we fill it with a function so we can fill it with custom stuff
        d3
            .select('#controls')
            .selectAll('button.teams')
            .data(dataKeys)
            .enter()
            .append('button')
            .on('click', buttonClick)
            .html(function (d) {
                return d;
            });

		/**
		 * The datapoint will be bound to the element that the button clicked
		 * @param {*} datapoint 
		 */
        function buttonClick(datapoint) {
            // maxValue is set so that in radiusScale we can assign it to change
            // depending on the selected attribute
            var maxValue = d3.max(incomingData, function (d) {
                return parseFloat(d[datapoint]);
            });

			/** Create a scale of the colors for the size of the radius
			 * We add interpolation because regular interpolate takes in all the color spectrum
			 * Theres Various interpolation methods besides Hsl, Hcl, Lab
			 * RGB tends to approach a muddy gray through its interpolation
			 *   */
            var ybRamp = d3
                .scaleLinear()
                .interpolate(d3.interpolateHsl)
                .domain([0, maxValue])
                .range(['yellow', 'blue']);

            // Lets create the scaleLinear to create a ramp of data
            var radiusScale = d3.scaleLinear().domain([0, maxValue]).range([2, 20]);

            // Changes all the circle's radius depending on which data key to use
            // Turn this off between the below to show or don't show the transition
			/*d3.selectAll('g.overallG').select('circle').attr('r', function(d) {
				return radiusScale(d[datapoint]);
			});*/

            // Changes all the circle's radius depending on which data key to use, then this should be making the
            // Transition between the different keys
            // Change the color as we change the data points using the scale that we have set from the top vbRamp
			/*d3.selectAll('g.overallG').select('circle').transition().duration(1000).style('fill', function(d) {
				return ybRamp(d[datapoint]);
			}).attr('r', function(d) {
				return radiusScale(d[datapoint]);
			});*/

			/**
			 * We will be creating a category color scale for the different associations using category10
			 * This will replace the animation sequence above
			 */
            // D3 v4 has new syntax for scaleOrdinal so we have to do it like this now
			/*var tenColorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(['CONMEBOL','UEFA','AFC','CAF']);
			d3
				.selectAll('g.overallG')
				.select('circle')
				.transition()
				.duration(1000)
				.style('fill', function(p) {
					return tenColorScale(p[region]);
				})
				.attr('r', function(p) {
					return radiusScale(p[datapoint]);
				});*/

			/**
			 * We are now going to use color brewer's library to encode the color below
			 */
            var colorQuantize = d3.scaleQuantize().domain([0, maxValue]).range(colorbrewer.Reds[5]);
            d3
                .selectAll('g.overallG')
                .select('circle')
                .transition()
                .duration(1000)
                .style('fill', function (p) {
                    return colorQuantize(p[datapoint]);
                })
                .attr('r', function (p) {
                    return radiusScale(p[datapoint]);
                });
        }
    }
}
