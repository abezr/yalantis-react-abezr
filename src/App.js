import React, { Fragment, useState, useEffect } from 'react';
import _ from 'lodash';
import './App.css';
const useDataApi = (initialUrl, initialData) => {
  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const result = await fetch(url);
        setData(_.groupBy(await result.json(), x => new Date(x.dob).getMonth()));
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [url]);
  return [{ data, isLoading, isError }, setUrl];
};
const colorByUsersNumber = n => {
  switch (true) {
    case n <= 2: return 'grey';
    case n >= 3 && n <= 6: return 'blue';
    case n >= 7 && n <= 10: return 'green';
    case n >= 11: return 'red';
    default: return;
  }
};
function App() {
  const [activeMonth, setActiveMonth] = useState('redux');
  const [{ data, isLoading, isError }] = useDataApi(
    'https://yalantis-react-school.herokuapp.com/api/task0/users',
    { },
  );
  return (
    <Fragment>
            {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <div>
<ul className="monthes-list">
{Object.entries(data).map(m => {
  const records = m[1];
  const monthName = new Date(records[0].dob).toLocaleString("default", { month: "long" });
  const isCurMonthActive = m[0] === activeMonth;
  const monthStyle = {
    border: `2px solid ${isCurMonthActive ? 'orange' : 'none'}`,
    background: colorByUsersNumber(records.length)
};
  return <li key={m[0]+isCurMonthActive} style={monthStyle}
  onMouseOver={e => setActiveMonth(m[0])}
  >{monthName}</li>
  })}
</ul>
<ul className="users-list">
{(data[activeMonth] || []).map(u => <li key={u.id}>{u.firstName} {u.lastName}</li>
  )}
</ul>
</div>
      )}
    </Fragment>
  );
}
export default App;