import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TopBarSub from '../../BaseForm/TopBarSub';
function a11yProps(index) { return { id: `simple-tab-${index}`, 'aria-controls': `simple-tabpanel-${index}`, }; } 

export default function() {
  const [ tab, setTab ] = useState(0);
  const { quarterID, lessonMonth } = useParams();
  return (
    <TopBarSub>
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="개요" {...a11yProps(0)} />
        <Tab label="1주차" {...a11yProps(1)} component={Link} to={`/lesson/detail/${quarterID}/${lessonMonth}/study/1`}/>
        <Tab label="2주차" {...a11yProps(2)} component={Link} to={`/lesson/detail/${quarterID}/${lessonMonth}/study/2`}/>
        <Tab label="3주차" {...a11yProps(3)} component={Link} to={`/lesson/detail/${quarterID}/${lessonMonth}/study/3`}/>
        <Tab label="4주차" {...a11yProps(4)} component={Link} to={`/lesson/detail/${quarterID}/${lessonMonth}/study/4`}/>
      </Tabs>
    </TopBarSub>
  );
}
