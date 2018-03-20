

( function() {
	

	
	CKEDITOR.inline = function( element, instanceConfig ) {
		if ( !CKEDITOR.env.isCompatible )
			return null;

		element = CKEDITOR.dom.element.get( element );

		// Avoid multiple inline editor instances on the same element.
		if ( element.getEditor() )
			throw 'The editor instance "' + element.getEditor().name + '" is already attached to the provided element.';

		var editor = new CKEDITOR.editor( instanceConfig, element, CKEDITOR.ELEMENT_MODE_INLINE ),
			textarea = element.is( 'textarea' ) ? element : null;

		if ( textarea ) {
			editor.setData( textarea.getValue(), null, true );

			//Change element from textarea to div
			element = CKEDITOR.dom.element.createFromHtml(
				'<div contenteditable="' + !!editor.readOnly + '" class="cke_textarea_inline">' +
					textarea.getValue() +
				'</div>',
				CKEDITOR.document );

			element.insertAfter( textarea );
			textarea.hide();

			// Attaching the concrete form.
			if ( textarea.$.form )
				editor._attachToForm();
		} else {
			// Initial editor data is simply loaded from the page element content to make
			// data retrieval possible immediately after the editor creation.
			editor.setData( element.getHtml(), null, true );
		}

		// Once the editor is loaded, start the UI.
		editor.on( 'loaded', function() {
			editor.fire( 'uiReady' );

			// Enable editing on the element.
			editor.editable( element );

			// Editable itself is the outermost element.
			editor.container = element;
			editor.ui.contentsElement = element;

			// Load and process editor data.
			editor.setData( editor.getData( 1 ) );

			// Clean on startup.
			editor.resetDirty();

			editor.fire( 'contentDom' );

			// Inline editing defaults to "wysiwyg" mode, so plugins don't
			// need to make special handling for this "mode-less" environment.
			editor.mode = 'wysiwyg';
			editor.fire( 'mode' );

			// The editor is completely loaded for interaction.
			editor.status = 'ready';
			editor.fireOnce( 'instanceReady' );
			CKEDITOR.fire( 'instanceReady', null, editor );

			// give priority to plugins that relay on editor#loaded for bootstrapping.
		}, null, null, 10000 );

		// Handle editor destroying.
		editor.on( 'destroy', function() {
			// Remove container from DOM if inline-textarea editor.
			// Show <textarea> back again.
			if ( textarea ) {
				editor.container.clearCustomData();
				editor.container.remove();
				textarea.show();
			}

			editor.element.clearCustomData();

			delete editor.element;
		} );

		return editor;
	};

	
	CKEDITOR.inlineAll = function() {
		var el, data;

		for ( var name in CKEDITOR.dtd.$editable ) {
			var elements = CKEDITOR.document.getElementsByTag( name );

			for ( var i = 0, len = elements.count(); i < len; i++ ) {
				el = elements.getItem( i );

				if ( el.getAttribute( 'contenteditable' ) == 'true' ) {
					// Fire the "inline" event, making it possible to customize
					// the instance settings and eventually cancel the creation.

					data = {
						element: el,
						config: {}
					};

					if ( CKEDITOR.fire( 'inline', data ) !== false )
						CKEDITOR.inline( el, data.config );
				}
			}
		}
	};

	CKEDITOR.domReady( function() {
		!CKEDITOR.disableAutoInline && CKEDITOR.inlineAll();
	} );
} )();


