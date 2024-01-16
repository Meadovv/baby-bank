import React, { useRef, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // import styles
import './PostEditor.css';

export default function PostEditor({content, setContent}) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [updateCount, setUpdateCount] = useState(0)

  useEffect(() => {
    quillRef.current = new Quill(editorRef.current, {
      theme: 'snow',
      bounds: '.text-editor',
      modules: {
        toolbar: [
          ['bold', 'underline'], // toggled buttons
          [{ 'color': [false, 'red', 'gray', 'yellow', 'green'] }], // text color
          [{ 'list': 'ordered'}, { 'list': 'bullet' }], // lists
          [{ 'align': [] }], // text alignment
          [{ 'header': [1, 2, 3, false] }], // headers
        ]
      }
    });

    if (content) {
      quillRef.current.setContents(content);
    }

    quillRef.current.on('text-change', function(delta, oldDelta, source) {
      setContent(quillRef.current.getContents())
    });
  
  }, []);

  useEffect(() => {
    // update one time only
    if (content && updateCount === 0) {
      quillRef.current.setContents(content);
      setUpdateCount(1)
    }
  }, [content])

  return (
    <div className="text-editor">
      <div ref={editorRef} />
    </div>
  );
}