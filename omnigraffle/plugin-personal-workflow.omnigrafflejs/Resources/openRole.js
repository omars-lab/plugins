/*
- https://omni-automation.com/actions/index.html
- https://omni-automation.com/plugins/index.html
- https://discourse.omnigroup.com/t/call-x-callback-url-from-omnijs/36756/3
- https://omni-automation.com/tools.html

	// Running plugin in console ...
	p = PlugIn.find('com.oeid.OmniGraffle')
	a = p.action('changeColorOfSelectedGraphics')
	a.perform()

	// document.windows[0].selection.canvas.graphics[0]
	// [object Group] {actionURL: null, alignsEdgesToGrid: true, allowsConnections: true, automationAction: [], connectToGroupOnly: false, connectedLines: [], cornerRadius: 0, flippedHorizontally: false, flippedVertically: false, geometry: [object Rect: (535.5, 117.0, 205.1364365971108, 200.0)], graphics: [[object Shape], [object Shape]], id: 31, incomingLines: [], layer: [object Layer], locked: false, magnets: [], name: "The Financer", notes: "", outgoingLines: [], plasticCurve: null, plasticHighlightAngle: null, rotation: 0, shadowColor: null, shadowFuzziness: 3, shadowVector: [object Point: (0.0, 2.0)], strokeCap: [object LineCap: Round], strokeColor: null, strokeJoin: [object LineJoin: Round], strokePattern: [object StrokeDash: Solid], strokeThickness: 1, strokeType: null, userData: [object Object]} = $16
*/

var _ = function(){
	var action = new PlugIn.Action(function(selection){
		// if called externally (from script) generate selection object
		if (typeof selection == 'undefined'){selection = document.windows[0].selection}
		
		text = selection.graphics[0].name
		// text = JSON.stringify(Object.fromEntries(new Map(Object.keys(selection), Object.values(selection))))

		var loc = encodeURIComponent("/Locations/personalbook/roles/" + text + "/Overview.md")

		// var alert = new Alert("alert", "before opening " + loc + "\n" + text)
		// alert.show(function (result) { })

		console.log(selection)
		console.log("before opening " + loc + "\n" + text)
		
		var aURL = URL.fromString("ia-writer://open?path=" + loc);
		aURL.call(function (data) {
			var alert = new Alert("alert", data.toString())
			alert.show(function (result) { })
		});

		// didnt work: window.open()
		// didnt work: app.openURL()
	});

	
	// result determines if the action menu item is enabled
	action.validate = function(selection){
		// check to see if any graphics are selected
		// if called externally (from script) generate selection object
		if (typeof selection == 'undefined'){selection = document.windows[0].selection}
		if (selection.graphics.length > 0){return true} else {return false}
	};

	return action;
}();
_;


