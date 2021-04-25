
export function getHandlar(
  setValues
) {
  return (err, result, previous) => {
    let status = 0;
    let message = null;
    let data = null;
    if(err instanceof Error) {
      status = err.response ? (err.response?.status ?? 400) : ((err.request) ? 500 : 400);
      if(status === 500) {
        message = '서버 측에서 문제가 발생했습니다.';
      }
      else {
        message = err.response?.data?.cause ?? '알 수 없는 오류가 발생했습니다.';
      }
    } else {
      status = 200;
      data = result.data?.fetchedData;
    }
    const state = {
      data,
      message,
      previous,
      status
    };
    setValues({ state });
  }
};
export function getToLink(
  pathname
) {
  return location => {
    return location.pathname === pathname ? location : pathname;
  }
}
