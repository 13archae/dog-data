const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        if (!didCancel) {
          let dogArray = Object.keys(result.data.message);
          console.log(`result ${JSON.stringify(dogArray)}`);

          dispatch({ type: "FETCH_SUCCESS", payload: dogArray });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};
// Get the list of Dog Breeds
function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "https://dog.ceo/api/breeds/list/all",
    {
      message: [],
    }
  );

  return (
    <Fragment>
      {isError && <div>Something went wrong ...</div>}

      {isLoading ? <div>Loading ...</div> : <p>{JSON.stringify(data)}</p>}
    </Fragment>
  );
}

// ========================================
ReactDOM.render(<App />, document.getElementById("root"));
