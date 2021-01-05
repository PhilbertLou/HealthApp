import React from "react";
import { BrowserRouter, Route, Switch, Redirect, useHistory, Link } from 'react-router-dom';
import '../../App.css';

function ChangeInfoPage(props){
    return(
        <div className="center-screen">
            {props.message?<div className="alert alert-danger formbox" role="alert">
                <div className="formbuttondiv">{props.message}</div>
            </div>: <br/>}
            <div className="formbox">
            <h1 className="title">Change Info</h1>
            <small className="text-muted"> Done making changes? <Link to="/home">Go back to home</Link></small>
            <br /><br />
            <form onSubmit={props.handleGoals}>
                <div className="form-group">
                    <label for="watergoal">New Water Goal:</label>
                    <input type="text" name="watergoal" value={props.water} placeholder="New Water Goal (in mL)" onChange={props.handleWChange} class="form-control forminput" id="watergoal" />
                </div>
                <div className="form-group">
                <label for="sugargoal">New Sugar Limit:</label>
                    <input type="text" name="sugargoal" value={props.sugar} placeholder="New Sugar Goal (in g)" onChange={props.handleSUChange} class="form-control forminput" id="sugargoal" />
                </div>
                <br />
                <div className="formbuttondiv">
                    <button type="submit" className="btn btn-dark formbutton">Change Goal/Limit</button>
                    <br /><br /><br />
                </div>
            </form>
            <form onSubmit={props.handlePass}>
            <div className="form-group">
                <label for="password">Password:</label>
                    <input type="text" name="password" value={props.password} placeholder="Current Password" onChange={props.handlePChange} class="form-control forminput" id="Password" />
                </div>
                <div className="form-group">
                <label for="password1">New Password:</label>
                    <input type="text" name="password1" value={props.password1} placeholder="New Password (Minimum 8 characters)" onChange={props.handleP1Change} class="form-control forminput" id="Password1" />
                </div>
                <div className="form-group">
                <label for="password2">Retype New Password:</label>
                    <input type="text" name="password2" value={props.password2} placeholder="Retype New Password" onChange={props.handleP2Change} class="form-control forminput" id="Password2" />
                </div>
                <br />
                <div className="formbuttondiv">
                    <button type="submit" className="btn btn-dark formbutton">Submit</button>
                    <br /><br /><br />
                </div>
            </form>
            <br /><br /><br /><br />
            </div>
        </div>
    )
}

export default ChangeInfoPage;