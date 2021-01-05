var _ = function(){
	var action = new PlugIn.Action(function(selection){
		versNum = this.plugIn.version.versionString
		author = this.plugIn.author
		pluginName = this.plugIn.displayName
		pluginID = this.plugIn.identifier
		pluginLibraries = this.plugIn.libraries
		if (pluginLibraries.length != 0){
			libraryNames = []
			pluginLibraries.forEach(function(aLibrary){
				libraryName = aLibrary.name
				libraryVersion = aLibrary.version.versionString
				displayString = libraryName + ' v' + libraryVersion
				libraryNames.push(displayString)
			})
			libraryNamesString = "LIBRARIES:"
			libraryNamesString = libraryNamesString + '\n' + libraryNames.join('\n')
		} else {
			libraryNamesString = "This plugin has no libraries."
		}
		alertTitle = pluginName + ' v' + versNum
		descriptionString = "A plugin demonstrating the use of Omni Automation to automate OmniGraffle in macOS and iOS."
		companyURL = 'https://github.com/omars-lab'
		alertMessage = "©2021 " + author + '\n'
		alertMessage = alertMessage + pluginID + '\n'
		alertMessage = alertMessage + companyURL + '\n' + '\n'
		alertMessage = alertMessage + descriptionString + '\n' + '\n' 
		alertMessage = alertMessage + libraryNamesString
		var alert = new Alert(alertTitle, alertMessage)
		alert.show(function(result){})
	});

	// routine determines if menu item is enabled
	action.validate = function(selection){
		return true
	};

	return action;
}();
_;