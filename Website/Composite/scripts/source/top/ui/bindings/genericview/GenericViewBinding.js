﻿GenericViewBinding.prototype = new TreeBinding;
GenericViewBinding.prototype.constructor = GenericViewBinding;
GenericViewBinding.superclass = TreeBinding.prototype;

GenericViewBinding.CLASSNAME = "generericview";
GenericViewBinding.CLASSNAME_SINGLE = "single";

/**
 * @class
 */
function GenericViewBinding() {

	/**
	 * @type {SystemLogger}
	 */
	this.logger = SystemLogger.getLogger("GenericViewBinding");

	/**
	 * Associates the tree to the selected perspective.
	 * @type {SystemNode}
	 */
	this.perspectiveNode = null;

	/**
	* Tree position 
	* @type {int}
	*/
	this._activePosition = SystemAction.activePositions.NavigatorTree;

}



/**
 * Identifies binding.
 */
GenericViewBinding.prototype.toString = function () {

	return "[GenericViewBinding]";
}

/**
 * @overloads {TreeBinding#onBindingRegister}
 */
GenericViewBinding.prototype.onBindingRegister = function () {

	GenericViewBinding.superclass.onBindingRegister.call(this);


	this.addActionListener(TreeNodeBinding.ACTION_COMMAND);
	this.addActionListener(TreeNodeBinding.ACTION_OPEN);

	this.attachClassName(GenericViewBinding.CLASSNAME);

	/*
	 * Mark the tree as resident on the currently selected perspective.
	 */
	this.perspectiveNode = StageBinding.perspectiveNode;
}


/**
 * @implements {IActionListener}
 * @overloads {TreeBinding#handleAction}
 * @param {Action} action
 */
GenericViewBinding.prototype.handleAction = function (action) {

	GenericViewBinding.superclass.handleAction.call(this, action);

	var binding = action.target;

	switch (action.type) {
		case TreeNodeBinding.ACTION_COMMAND:
			EventBroadcaster.broadcast(BroadcastMessages.INVOKE_DEFAULT_ACTION);
			action.consume();
			break;
		case TreeNodeBinding.ACTION_OPEN:

			EventBroadcaster.broadcast(
				BroadcastMessages.SYSTEMTREEBINDING_FOCUS,
				action.target.node.getEntityToken()
			);
			action.consume();
			break;
	}
}

/**
 * Set showing children of SystemNode
  * @param {SystemNode} node
 */
GenericViewBinding.prototype.setNode = function (node) {

	this.empty();
	this.detachClassName(GenericViewBinding.CLASSNAME_SINGLE);

	if (node) {
		if (node.hasChildren()) {
			
			var children = node.getChildren();

			while (children.hasEntries()) {
				var child = children.extractFirst();
				this.addNode(child);
			}
		} else {
			this.attachClassName(GenericViewBinding.CLASSNAME_SINGLE);
			this.addNode(node);
		}
	}
}

/**
 * Add node to tree
  * @param {SystemNode} node
 */
GenericViewBinding.prototype.addNode = function (child) {
	var treenode = TreeNodeBinding.newInstance(this.bindingDocument
				);
	treenode.node = child;
	var label = treenode.node.getLabel();
	if (label) {
		treenode.setLabel(label);
	}

	var imageProfile = treenode.node.getImageProfile();
	if (imageProfile) {
		treenode.setImage(imageProfile.getDefaultImage());
	}

	treenode.isContainer = treenode.node.hasChildren();
	this.add(treenode);
	treenode.attach();
}


/**
 * Return perspective handle for tree
 */
GenericViewBinding.prototype.getPerspectiveHandle = function () {

	return this.perspectiveNode.getHandle();
}

/**
 * Invoked when tree focus changes AND when tree itself recieves the focus  
 * AND when lock-tree-to-editor feature updates the treenode focus.
 */
GenericViewBinding.prototype._handleSystemTreeFocus = function () {

	if (this.getFocusedTreeNodeBindings().hasEntries()) {
			EventBroadcaster.broadcast(
				BroadcastMessages.SYSTEM_ACTIONPROFILE_PUBLISHED,
				{
					activePosition: this._activePosition,
					actionProfile: this.getCompiledActionProfile(),
					//perspectiveHandle: this.getPerspectiveHandle()
				}
			);
	}
}

/**
 * @overloads {TreeBinding#focusSingleTreeNodeBinding}
 * @param {TreeNodeBinding} binding;
 */
GenericViewBinding.prototype.focusSingleTreeNodeBinding = function (binding) {

	GenericViewBinding.superclass.focusSingleTreeNodeBinding.call(this, binding);
	if (binding != null) {
		this._handleSystemTreeFocus();
	}
};




/**
 * Compile actionprofile based on the individual actionprofile of all focused treenodes.
 * In case of multiple focused treenodes, only SystemActions relevant for *all* focused 
 * treenodes will be included in the result.
 * @return {Map<string><List<SystemAction>>}
 */
GenericViewBinding.prototype.getCompiledActionProfile = SystemTreeBinding.prototype.getCompiledActionProfile;


/**
 * TreeBinding factory.
 * @param {DOMDocument} ownerDocument
 * @return {TreeBinding}
 */
GenericViewBinding.newInstance = function (ownerDocument) {

	var element = DOMUtil.createElementNS(Constants.NS_UI, "ui:tree", ownerDocument);
	var binding = UserInterface.registerBinding(element, GenericViewBinding);
	binding.treeBodyBinding = TreeBodyBinding.newInstance(ownerDocument);
	return binding;
}