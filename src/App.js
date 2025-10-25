import { useState, useRef, useCallback } from "react";
import useBookSearch from "./hooks/useBookSearch";
function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const {books, hasMore, loading, error} = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback((node)=>{
    if (loading) return;
    if (observer.current) {observer.current.disconnect()};//to disconnect from previous last element when newly scrolled down
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore){
        setPageNumber(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
    console.log('node', node);
  }, [loading, hasMore]);


  return (
    <div className="App">
      <input type="text" value={query} onChange={(e)=>{setQuery(e.target.value); setPageNumber(1)}} />
      {books.map((book, index) => {
        if(index === books.length-1){
          return <div ref={lastBookElementRef} key={book}>{book}</div>
        } else{
          return <div key={book}>{book}</div>
        }
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error...'}</div>
    </div>
  );
}

export default App;
