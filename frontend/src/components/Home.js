import React ,{ useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
// import UpdateItem from "./UpdateItem"

function Home(props){
    axios.defaults.withCredentials = true;

    const [name, setname] = useState("");
    const [date, setdate] = useState("");
    const [water, setwater] = useState(0);
    const [sugar, setsugar] = useState(0);
    const [sodium, setsodium] = useState(0);
    // const [updates, setupdates] = useState([]);
    const [wGoal, setwGoal] = useState(0);
    const [soGoal, setsoGoal] = useState(0);
    const [suGoal, setsuGoal] = useState(0);
    const [addedwater, setaddedwater] = useState(0);
    const [addedsugar, setaddedsugar] = useState(0);
    const [waternum, setwaternum] = useState(10);
    const [sugarnum, setsugarnum] = useState(1);
    const [message, setmessage] = useState("");
    const [directwater, setdirectwater] = useState();
    const [directsugar, setdirectsugar] = useState();
    const history = useHistory();
    // const [updates, setupdates] = useState([]);
    // var test;

    useEffect(() =>{
        // console.log("HERE");
        let isMounted = true;
        axios.get('http://localhost:8080/user/homepage/')
            .then(res => {
                if (isMounted){
                    setname(res.data.name);
                    setdate(res.data.date);
                    setwater(res.data.currentDay.water);
                    setsugar(res.data.currentDay.sugar);
                    setsodium(res.data.currentDay.sodium);
                    setwGoal(res.data.currentDay.wGoal);
                    setsoGoal(res.data.currentDay.soGoal);
                    setsuGoal(res.data.currentDay.suGoal);
                }
                // setupdates(res.data.currentDay.updates);
                // props.addmessage(res.data.name);
            })
            .catch(err => {if (err.response){
                setmessage(err.response.data.message);
            }})
            // console.log(props);
            return () => { isMounted = false };
    }, [])
    
    function handleLogout(e){
        //check credientials, if its right then redirect them, may need to mark as authenticated?
        //or just try and auth then redirect to login again and let app handle the rest
        e.preventDefault();
        console.log(`Form submitted:`);

        axios.post('http://localhost:8080/user/logout/')
            .then(res => {
                // props.addmessage(res.data.message);
                props.changeStatus(false);
                history.push("/login");
            })
            .catch(err => {if (err.response){
                // props.addmessage(err.response.data.message);
                props.changeStatus(false);
                history.push("/login");
            }})
    }

    function handleUpdates(e){
        //check credientials, if its right then redirect them, may need to mark as authenticated?
        //or just try and auth then redirect to login again and let app handle the rest
        e.preventDefault();
        console.log(`Form submitted:`);

        history.push("/updates");
    }

    function handleChanges(e){
        //check credientials, if its right then redirect them, may need to mark as authenticated?
        //or just try and auth then redirect to login again and let app handle the rest
        e.preventDefault();
        console.log(`Form submitted:`);

        history.push("/changeinfo");
    }

    function handlePrevious(e){
        //check credientials, if its right then redirect them, may need to mark as authenticated?
        //or just try and auth then redirect to login again and let app handle the rest
        e.preventDefault();
        console.log(`Form submitted:`);

        history.push("/previousdays");
    }

    function handleTrack(e){
        //check credientials, if its right then redirect them, may need to mark as authenticated?
        //or just try and auth then redirect to login again and let app handle the rest
        e.preventDefault();
        console.log(`Form submitted:`);

        const info = {
            water: addedwater,
            sugar: addedsugar,
            sodium: 0
        }
        console.log(info.water)
        console.log(info.sugar)
        axios.post('http://localhost:8080/today/addinfo', info)
            .then(res => {
                setmessage(res.data.message);
                setaddedwater(0);
                setaddedsugar(0);
            })
            .catch(err => {if (err.response){
                setmessage(err.response.data.message);
            }})
    }

    // function maketest(){
    //     if(updates){
    //         test = updates.map(item => <UpdateItem key={item._id} item={item}/>)
    //     }
    // }

    function incrementwater() {
        setwater(prevCount => prevCount + waternum);
        setaddedwater(prevCount => prevCount + waternum);
    }

    function incrementsugar() {
        setsugar(prevCount => prevCount + sugarnum);
        setaddedsugar(prevCount => prevCount + sugarnum);
    }

    function deincrementwater() {
        if (water-waternum >= 0){
            setwater(prevCount => prevCount - waternum);
            setaddedwater(prevCount => prevCount - waternum);
        }
    }

    function deincrementsugar() {
        if (sugar-sugarnum >= 0){
            setsugar(prevCount => prevCount - sugarnum);
            setaddedsugar(prevCount => prevCount - sugarnum);
        }
    }

    function water10() {
        setwaternum(10);
    }
    function water50() {
        setwaternum(50);
    }
    function water100() {
        setwaternum(100);
    }
    function sugar1() {
        setsugarnum(1);
    }
    function sugar5() {
        setsugarnum(5);
    }
    function sugar10() {
        setsugarnum(10);
    }
    function handleWChange(e) {
        if(e.target.value >=0){
            setdirectwater(e.target.value);
            setwater(e.target.value);
            setaddedwater(e.target.value - water);
        }
        else{
            setmessage('Number cannot be less than zero, value will be set to 0');
        }
    }
    function handleSUChange(e){
        if(e.target.value >=0){
            setdirectsugar(e.target.value);
            setsugar(e.target.value);
            setaddedsugar(e.target.value - water);
        }
        else{
            setmessage('Number cannot be less than zero, value will be set to 0');
        }
    }

    return (
        <div>
            {/* {maketest()} */}
            <p>{name}</p>
            <br/ >
            <p>{date}</p>
            <br/ >
            <p>{water}</p>
            <br/ >
            <p>{sodium}</p>
            <br/ >
            <p>{sugar}</p>
            <br/ >
            {/* <p>{updates}</p>
            <br/ > */}
            <p>{wGoal}</p>
            <br/ >
            <p>{soGoal}</p>
            <br/ >
            <p>{suGoal}</p>
            <br/ >
            {/* {test} */}
            <button onClick={water10}>10</button>
            <button onClick={water50}>50</button>
            <button onClick={water100}>100</button>
            <input type="number" name="directwater" value={directwater} placeholder="Set Water" onChange={handleWChange} />
            <button onClick={sugar1}>1</button>
            <button onClick={sugar5}>5</button>
            <button onClick={sugar10}>10</button>
            <input type="number" name="directsugar" value={directsugar} placeholder="Set Sugar" onChange={handleSUChange} />
            <br />
            <button onClick={incrementwater}>+</button>
            <button onClick={deincrementwater}>-</button>
            <button onClick={incrementsugar}>+</button>
            <button onClick={deincrementsugar}>-</button>
            <br />
            <form onSubmit={handleTrack}>
                <button type="submit">Save Update</button>
            </form>
            <form onSubmit={handleLogout}>
                <button type="submit">Logout</button>
            </form>
            <form onSubmit={handleUpdates}>
                <button type="submit">See Updates</button>
            </form>
            <form onSubmit={handleChanges}>
                <button type="submit">Change Info</button>
            </form>
            <form onSubmit={handlePrevious}>
                <button type="submit">See previous Days</button>
            </form>
            {message}
        </div>
    )
}

export default Home;