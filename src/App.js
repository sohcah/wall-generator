import React from 'react';
import logo from './logo.svg';
// import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image';
import { Textfit } from 'react-textfit';
import { saveAs } from 'file-saver';
import './App.css';

function App() {
  // var q = [
  //   [
  //     "Ends with first 3 letters of a month",
  //     ["Concoct","Neymar","Trojan","Codec"],
  //     true
  //   ],
  //   [
  //     "Films starring Kristen Stewart",
  //     ["Seberg","Equals","Jumper","Undertow"],
  //     true
  //   ],
  //   [
  //     "Birds",
  //     ["Craven","Regret","Bandicoot","Stern"],
  //     true
  //   ],
  //   [
  //     "",
  //     ["Twilight","Platypus","Garlic","Panther"],
  //     false
  //   ],
  //   [
  //     "",
  //     ["Sunlight","Tiger","Vogue","Bat"],
  //     false
  //   ],
  //   [
  //     "",
  //     ["Raider","Mammoth","Jungle","Wolf"],
  //     false
  //   ],
  //   [
  //     "",
  //     ["Amazon","Showdown","Rhino","Diesel"],
  //     false
  //   ],
  //   [
  //     "",
  //     ["Blade","Confusion","Red","Cat"],
  //     false
  //   ],
  //   [
  //     "",
  //     ["Hat","Suntherland","Buffalo","Howl"],
  //     false
  //   ],
  // ]
  function rndstr() {
    return Math.floor(Math.random()*10000)
  }

  var [q,setQ] = React.useState([])
  var [shown,setShown] = React.useState(0);
  var [solved,setSolvedX] = React.useState([]);
  React.useEffect(()=>{
    setQ(JSON.parse(localStorage.q||"[]").map(i=>{
      console.log('XXX',i);
      if(i[2]===true||i[2]===false) {
        i[2]=rndstr();
      }
      return i;
    }))
    setSolvedX((localStorage.solved||"").split(',').filter(i=>i));
  },[])
  function setSolved(x) {
    setSolvedX(x);
    localStorage.solved = x.join(',');
  }
  var [canvas,setCanvas] = React.useState(null)
  var [grid6,set6] = React.useState(false);
  // var q = [
  //   [
  //     "Square Numbers",
  //     ["1","4","9","16"],
  //     true
  //   ],
  //   [
  //     "Odd Prime Numbers",
  //     ["5","7","11","13"],
  //     true
  //   ],
  //   [
  //     "Triangle Numbers",
  //     ["3","6","10","15"],
  //     true
  //   ],
  //   [
  //     <><strike style={{marginRight:'4px'}}>Even Numbers</strike> Subtract from 25 to get a prime</>,
  //     ["2","8","12","14"],
  //     true
  //   ]
  // ]
  var x = [];
  var i = 0;
  var colors = ["green","blue","pink","red","orange","purple","yellow","aqua","blue-2","black",null];

  var solutions = [];

  for(var aa of solved) {
    let o = q.find(i=>i[2]==aa);
    if(o) {
      x.push([colors[i],...o[1]]);
      if(q.length==4||q.length==90) x.push([colors[i],o[0]])
      if(q.length!=4&&q.length!=90) solutions.push(o[0])
      i++;
    }
  }
  // for(var o of q.filter(i=>solved.includes(i[2].toString()))) {
  // }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  var rnd = [];
  for(var o of q.filter(i=>!solved.includes(i[2].toString()))) {
    rnd.push(...o[1])
  }
  shuffle(rnd);
  for(var i = 0;i < rnd.length/4;i++) {
    x.push(["",rnd[(i*4)+0],rnd[(i*4)+1],rnd[(i*4)+2],rnd[(i*4)+3]])
  }
  function set(a, index, value, subvalue) {
    if(subvalue!==undefined) {
      q[index][value][subvalue] = a;
    } else {
      q[index][value] = a;
    }
    setShown(0);
    setQ(q.slice());
    localStorage.q = JSON.stringify(q);
  }
  console.log(solved);
  function toggleSolved(id,checked) {
    if(!checked) {
      setSolved(solved.filter(i=>i!=id))
    } else {
      setSolved(solved.concat([id.toString()]));
    }
  }
  // var screenshot;
  function screenshot() {
    // html2canvas(document.getElementById('screenshot')).then(function(canvas) {
    //   document.body.appendChild(canvas);
    // });
    domtoimage.toBlob(document.getElementById('screenshot'))
      .then(function (blob) {
          window.saveAs(blob, 'wall.png');
      })
      .catch(function (error) {
          console.error('oops, something went wrong!', error);
      });
  }
  // var x = [
  //   ["green","Celestella","Treasure Island","Topaz","Kaa"],
  //   ["green","Description of Category"],
  //   ["blue","Bubble","Marnie","Rebecca","Lifeboat"],
  //   ["blue","Description of Category"],
  //   ["red","Spellbound","Cellophane","Rope","Ekans"],
  //   ["red","Description of Category"],
  //   ["pink","Some","Unsolved","Stuff","Fantastic"],
  //   ["pink","Description of Category"]
  // ]
  return (
    <div className="App">
      <div>
        <div style={{padding:8,display:"block",width:'100%'}}>
          <div className={`box box-wide box-aqua`} style={{width:'100%'}}>Update 27/03/2020 - Solved Groups now stay in order, text now shrinks to fit boxes</div>
        </div>
        <div style={{padding:8,display:"block",width:'100%'}}>
          <div className={`box box-wide box-green`} style={{width:'100%'}}>Update 13/02/2020 - Added 6x6 Grid option, added support for 4x10 and 4x11 and Bug Fixes</div>
        </div>
        {q.map((a,i)=><div className="border">
          <div style={{width:'100%'}}>
            <input placeholder="Group Description" onChange={(ev)=>set(ev.target.value,i,0)} value={a[0]}/>
          </div>
          <div>
            <input placeholder="Group Item 1" onChange={(ev)=>set(ev.target.value,i,1,0)} value={a[1][0]}/>
            <input placeholder="Group Item 2" onChange={(ev)=>set(ev.target.value,i,1,1)} value={a[1][1]}/>
            <input placeholder="Group Item 3" onChange={(ev)=>set(ev.target.value,i,1,2)} value={a[1][2]}/>
            <input placeholder="Group Item 4" onChange={(ev)=>set(ev.target.value,i,1,3)} value={a[1][3]}/>
          </div>
          Solved? <input type="checkbox" onChange={(ev)=>toggleSolved(a[2],ev.target.checked)} checked={solved.includes(a[2].toString())}/>
        </div>)}
        <button onClick={()=>setQ(q.concat([[
          "",
          ["","","",""],
          Math.floor(Math.random()*200000).toString(36)
        ]]))}>Add Group</button><br/>
        6x6 Grid Style? <input type="checkbox" onChange={(ev)=>set6(ev.target.checked)} checked={grid6}/><br/>
        <button style={{border:"1px solid red",color:"red"}} onClick={()=>setQ([])}>Reset Wall</button><br/>
        <button style={{border:"1px solid green",color:"green"}} onClick={()=>setShown(shown+1)}>Generate Wall</button><br/>
        {!!shown&&screenshot&&<button style={{border:"1px solid green",color:"green"}} onClick={screenshot}>Take Screenshot</button>}
      </div>
      {!!shown&&<div id="screenshot" style={{display:'inline-block'}}>
        <div style={{backgroundColor:'#aaa',padding:16,paddingBottom:0,flexWrap:"wrap",display:"flex",width:grid6?1028:undefined,flexDirection:q.length==4?"column":"row"}}>
          {x.map(i=><div style={{display:"flex",width:grid6?332:undefined,flexWrap:"wrap",flexDirection:(q.length==4||grid6)?"row":"column"}}>
            {i.slice(1).map(a=><div style={{padding:8}}>
              <Textfit max={28} mode="multi"><div className={`box${i.length==2?' box-wide':''} box-${i[0]}`}>{a}</div></Textfit>
            </div>)}
          </div>)}
        </div>
        <div style={{backgroundColor:'#aaa',width:grid6?1028:(166*q.length)+32,padding:16,paddingTop:0,display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
          {solutions.map((i,index)=>
              <div style={{padding:8,display:"inline-block",width:`${q.length<9?100/2:100/3}%`}}>
                <Textfit max={28} mode="multi"><div className={`box box-wide box-${colors[index]}`} style={{width:'100%'}}>{i}</div></Textfit>
              </div>)}
            <div style={{width:'100%'}}>
              <div style={{paddingLeft:8,paddingTop:8,fontSize:'1.2em',display:"inline-block",width:"50%",textAlign:"left"}}>
                Wall Generator by sohcah
              </div>
              <div style={{paddingRight:8,paddingTop:8,fontSize:'1.2em',display:"inline-block",width:"50%",textAlign:"right"}}>
                https://wallgenerator.web.app
              </div>
            </div>
        </div>
      </div>}
    </div>
  );
}

export default App;
