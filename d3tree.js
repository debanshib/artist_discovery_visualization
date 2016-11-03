//INITIALIZE TREE

var canvas = d3.select('.d3container').append('svg')
.style('overflow','scroll')
.attr('width', '100%')
.attr('height', '100%')
.append('g')
.attr('transform', 'translate(50,50)')


var linkG = canvas.append('g')
var nodeG = canvas.append('g')


var width = window.innerWidth;
var height = window.innerHeight;

var tree = d3.layout.tree()
.size([height * .75, width * .65]) //height, width
.separation(function(a,b){return a.parent == b.parent ? 1 : 2})
// .size([800, 1000]) //height, width


var diagonal = d3.svg.diagonal()
.projection(function(d){return [d.y,d.x]})

d3.select(self.frameElement).style("height", "400px"); //800px


//FUNCTION TO TOGGLE TREE EXPANSION AND COMPRESSION

function toggleArtists(d) {
	if (d.children) {
		d._children = d.children;
		d.children = null;
	} else {
		d.children = d._children;
		d._children = null;
	}
}

//FUNCTION TO TOGGLE BETWEEN SONG PLAYING AND SONG PAUSE

var currentSongD;
function toggleSound(d) {
	if (currentSongD && currentSongD !== d) currentSongD.play = false;
	if (d.play && d.play === true) {
		stopSong(d.id)
		d.play = false;
	} else {       
		d.play = true;
		playArtist(d.id)
		currentSongD = d;
	}
}


//FUNCTION TO UPDATE THE VISUAL TREE TO REFLECT NEW DATA AND ACTIONS

function updateD3Graph(artistTree, currentNode){
	
	var nodes = tree.nodes(artistTree);
	var links = tree.links(nodes);

	var node = nodeG.selectAll('.node')
		.data(nodes, function(d){return d.id})

    node.attr('transform', function(d){return 'translate(' + d.y + ',' + d.x + ')'}) //update selection
		
    node.select('image.song') //update the play and pause icons
    	.attr('xlink:href', function(d){
	    	if (d.play === undefined || d.play === false) {
	    		d.play = false;
	    		return 'playimage.png'
	    	}
	    	else if (d.play === true) return 'pauseimage.png'
    	})
	
	var nodeEnter = node.enter()
            .append('g')
            .attr('class','node')
            .attr('id', function(d){return d.id})
            .attr('transform', function(d){return 'translate(' + d.y + ',' + d.x + ')'})



    nodeEnter.append('image') //album image
        .attr('class','album')
        .attr('xlink:href', function(d){return d.data.image.url})
        .attr('x','-12px')
        .attr('y','-12px')
        .attr('width','40px')
        .attr('height','40px')
        .on('click', function(d){  //on clicking the album, there are 3 options:
        	if (d._children) { // 1. expand the data
        		toggleArtists(d)
        		updateD3Graph(artistTree, currentNode)
        		return;
        	}
        	if (d.children) { // 2. compress the data
        		toggleArtists(d)
        		updateD3Graph(artistTree, currentNode)
        		return;
        	}
        	else selectNextRelevantArtist(d.id, currentNode) // 3. fetch the data and expand
        })


    nodeEnter.append('image') //play-pause icon
        .attr('class','song')
        .attr('xlink:href', 'playimage.png')
        .attr('x','35px')
        .attr('y','5px')
        .attr('width','35px')
        .attr('height','35px')
        .on('click', function(d){ //on clicking the icon, start playing song, or pause song
        	toggleSound(d);
        	updateD3Graph(artistTree, currentNode)
        })    


    nodeEnter.append('text') //artist names appended to tree
        .text((d)=>{ return d.data.name })
        .attr('x','40px')
        .style('font-size', '22px')


    var link = linkG.selectAll('.link')
        .data(links, function(d){return d.source.id + '-' + d.target.id}) //connect existing to new (links via node id), otherwise done via index
        
    link.enter()
	    .append('path')
	    .attr('class','link')
	    .attr('fill','none')
	    .attr('stroke','#ADADAD')

    link.attr('d', diagonal)

    var nodeExit = node.exit()
        .transition()
        .attr('transform', function(d){return 'translate(' + d.y + ',' + d.x + ')'})
        .remove()

    var linkExit = link.exit()
        .transition()
        .attr('d', function(d){
        	var o = {x: d.source.x, y: d.source.y}
        	return diagonal({source: o, target: o})
        })
        .remove()

    nodes.forEach((d)=>{
        d.y = d.depth * 90
    })

    nodes.forEach((d)=>{
       	d.x0 = d.x;
        d.y0 = d.y;
    })
}

