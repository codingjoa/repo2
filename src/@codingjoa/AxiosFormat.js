/* @codingjoa
   만들다 맘, 경로를 지정할 방법이...
*/

export function useAxiosGet(url) {
  const AxiosGetContext = React.createContext(null);



}


function AxiosFormat({ children }) {
  const [ api, setApi ] = React.useState(null);
  const [ state, setState ] = React.useState(null);
  
  React.useLayoutEffect(() => {
    if(api === null) {
      axios.get(url);
    }
  }, [ api ]);

  const store = {
    api,
    state,
    fetch() {
      setApi(null);
    }
  };
  return (
    <AxiosFormatContext.Provider value={store}>
      {children}
    </AxiosFormatContext.Provider>
  );
}

export const useAxiosFormat = () => useContext(AxiosFormatContext);
export AxiosFormat;