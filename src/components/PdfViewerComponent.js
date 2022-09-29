import {useEffect, useRef} from "react";

let instance, PSPDFKit = null;

export default {
	PdfViewerComponent: PdfViewerComponent,
	getNewPSPDFKit: () => getNewPSPDFKit(),
	getPspdfkit: () => getPspdfkit(),
	getInstance: () => getInstance()
}

function getPspdfkit() {
	return PSPDFKit;
}

function getNewPSPDFKit() {
	return new PSPDFKit;
}

function getInstance() {
	return instance;
}

function PdfViewerComponent(props) {
	const containerRef = useRef(null);

	useEffect(() => {
		console.log('waahoo 2')
		const container = containerRef.current;

		(async function () {
			PSPDFKit = await import("pspdfkit");
			instance = await PSPDFKit.load({
				// Container where PSPDFKit should be mounted.
				container,
				// The document to open.
				document: props.document,
				// Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
				baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
				showToolbar: false
			});

			const viewState = instance.viewState;
			instance.setViewState(viewState.set("showToolbar", false).set("zoom", "FIT_TO_WIDTH"));
			instance.zoomIn();
		})();

		return () => PSPDFKit && PSPDFKit.unload(container);
	}, []);


	return (
		<div ref={containerRef} style={{width: "98%", height: "94vh"}}/>
	);
}

