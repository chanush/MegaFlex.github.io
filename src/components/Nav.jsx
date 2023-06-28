import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Manager_Product_List from "./Manager_Product_List";
import Manager_Add_Product from "./Manager_Add_Product";
import Manager_Orderding_List from "./Manager_Orderding_List";
import Manager_Profits from "./Manager_Profits";
import { Link, Outlet } from "react-router-dom"
import '../App.css';

export default function Nav(props) {
    const [mystyle, setMystyle] = useState({});
    useEffect(() => {
        setMystyle({
            color: "#3aedff",
            fontSize: "20px", marginLeft: "330px",
            marginTop: "70PX"
        });
    }, []);
    return (
    <div>
        <div className="">
            <nav id="navs ">
                <Link className="App-link" style={mystyle} to={`/manager/productlist`}>productlist</Link>
                <Link className="App-link" style={mystyle} to={`/manager/addProduct`}>addProduct</Link>
                <Link className="App-link" style={mystyle} to={`/manager/orderingList`}>orderingList</Link>
                <Link className="App-link" style={mystyle} to={`/manager/profits`}>profits</Link>
                <Link className="App-link" style={mystyle} to={`/manager/addCategory`}>add category</Link>
                <Link className="App-link" style={mystyle} to={`/manager/itemsToOrder`}>items to order</Link>
                <Link className="App-link" style={mystyle} to={`/manager/allUsers`}>see all users</Link>
                <Link className="App-link" style={mystyle} to={`/Log_Out`}>log out</Link>
            
            </nav>
            <Outlet />
        </div>
        
    </div>);
}