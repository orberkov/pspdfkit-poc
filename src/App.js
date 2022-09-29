import logo from './logo.svg';
import './App.css';
import pspdfkit from './components/PdfViewerComponent';
import {useEffect, useRef} from 'react';

// sources:
// https://pspdfkit.com/guides/web/knowledge-base/highlight-custom-search-results/


function DocumentViewerComponent() {
  return (
      <div className="PDF-viewer" style={{width: '98vw'}}>
        <pspdfkit.PdfViewerComponent
            document={"document.pdf"}
        />
      </div>
  );
}


function App() {

    setTimeout(() => {
        // debugger
    }, 0)

    let component = DocumentViewerComponent();
    const inputRef = useRef(null);

    async function find(event) {
        let query = inputRef.current.value;
        let instance = pspdfkit.getInstance();

        let pageCount = pspdfkit.getInstance().totalPageCount;
        //https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n
        let pages = Array.from({length: pageCount}, (_, i) => i + 1);

        for (const pageIndex in pages) {
            let annotations = await instance.getAnnotations(Number(pageIndex));
            const annotation = annotations.get(0);
            await instance.delete(annotations);
            console.log("Annotation deleted.");
        }

        const results = await instance.search(query);
        const annotations = results.map(result => {
            let x = pspdfkit.getPspdfkit();
            let t = x.Annotations.HighlightAnnotation;
            return new t({
                pageIndex: result.pageIndex,
                rects: result.rectsOnPage,
                boundingBox: x.Geometry.Rect.union(result.rectsOnPage),

            });
        });

        instance.setToolbarItems([]);
        instance.setAnnotationToolbarItems(() => []);
        instance.setDocumentEditorToolbarItems([]);
        instance.create(annotations);

    }


  return (
    <div className="App">
      <header className="App-header">
          <div>
              <input ref={inputRef} name={'find'} type={'text'}  />
              <button onClick={ find }>Find</button>
          </div>
          {component}
      </header>
    </div>
  );
}

export default App;
