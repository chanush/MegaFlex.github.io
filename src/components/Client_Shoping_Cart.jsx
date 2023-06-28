import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import Client_Current_Product from "./Client_Current_Product";
// import Client_Product_In_Cart from "./Client_Product_In_Cart";
import Client_Nav from "./Client_Nav";

export default function Client_Shoping_Cart() {
    const [products, setProducts] = useState([]);
    const [orderid, setOrderid] = useState([]);
    const [proinstore, setproinstore] = useState([]);
    const [outOfStock, setOutOfStock] = useState([]);
    const [belowStock, setBelowStock] = useState([]);
    const [quantity, setquantity] = useState([]);

    let navigate = useNavigate();
    useEffect(() => {
        let myquantity = [];
        let usercart = JSON.parse(sessionStorage.getItem('currentuser')).cart;
        let Allitemss = usercart;
        setProducts(Allitemss);
        checkbtns(Allitemss);
        // checkAtStart();

        Allitemss.forEach(element => {
            myquantity.push({ quantity: element.QuantityItem, itemname: element.ItemName });
        })
        setquantity(myquantity);
        return async () => {
            let ans = await fetch("http://localhost:3678/cart/quantity", {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quantity: myquantity
                })
            })
            ans = await ans.json();
            
        }
        
    }, []);
    async function checkbtns(Allitemss) {
        let arrm = [];
        let arrp = [];
        let userid = JSON.parse(sessionStorage.getItem('currentuser')).OrderID;

        let pro_in_cart_and_store = await fetch(`http://localhost:3678/products/item/name`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ OrderID: userid })
        })
        pro_in_cart_and_store = await (pro_in_cart_and_store).json();
        setproinstore(pro_in_cart_and_store);
        Allitemss.map(element => {
            console.log("pro_in_cart_and_store: " + pro_in_cart_and_store);
            pro_in_cart_and_store.map(proelement => {
                if (element.ItemName === proelement.ItemName) {
                    if (element.QuantityItem >= proelement.QuantityItem) {
                        arrp.push(true);
                        arrm.push(false)
                    } else {
                        if (element.QuantityItem-1 <= 0) {
                            arrm.push(true);
                            arrp.push(false);
                        } else {
                            arrp.push(false);
                            arrm.push(false);

                        }
                    }
                }
            });
        });
        setOutOfStock(arrp);
        setBelowStock(arrm);
        // checkAtStart();

    }
    async function checkAtStart() {
        let arrm = belowStock;
        let arrp = outOfStock;
        let arrq = quantity;
        let user = JSON.parse(sessionStorage.getItem("currentuser"));
        let carty = user.cart;

        proinstore.map((proelement,i) => {
            carty.map((cart, index) => {
                if (cart.ItemName === proelement.ItemName) {
                    if (cart.QuantityItem + 1 >= proelement.QuantityItem) {
                        arrp[i] = true;
                    }
                    else
                    {
                        if (cart.QuantityItem - 1 <= 0) {
                            arrm[i] = true;
                        } else {
                            arrp[i] = false;
                            arrm[i] = false;

                        }
                    }

                }
            })


        });

        setOutOfStock(arrp);
        setBelowStock(arrm);
        // window.location.reload();
    }


async function forPaying() {
    navigate("/client/finalBill", { state: { products: products, orderid: orderid } });
}
async function increaseQ(i, myproduct) {
    let arrm = belowStock;
    let arrp = outOfStock;
    let arrq = quantity;
    arrq[i].quantity += 1;
    let user = JSON.parse(sessionStorage.getItem("currentuser"));
    let carty = user.cart;
    carty.map((cart, index) => {
        if (cart.ItemName === myproduct.ItemName) {
            carty[index].QuantityItem += 1;
        }
    })
    sessionStorage.setItem("currentuser", JSON.stringify({ password: user.password, user_name: user.user_name, cart: carty, OrderID: user.OrderID }));
    setquantity(arrq);
    proinstore.forEach(proelement => {
        if (myproduct.ItemName === proelement.ItemName) {
            if (myproduct.QuantityItem + 1 >= proelement.QuantityItem) {
                arrp[i] = true;
            } else {
                if (myproduct.QuantityItem - 1 <= 0) {
                    arrm[i] = true;
                } else {
                    arrp[i] = false;
                    arrm[i] = false;

                }
            }
        }
    });

    setOutOfStock(arrp);
    setBelowStock(arrm);
    window.location.reload();
}
async function reduceQ(i, myproduct) {
    let arrm = belowStock;
    let arrp = outOfStock;
    let arrq = quantity;
    let user = JSON.parse(sessionStorage.getItem("currentuser"));
    let carty = user.cart;
    // 
    
    proinstore.map(proelement => {
        if (myproduct.ItemName === proelement.ItemName) {
            if (myproduct.QuantityItem-1  >= proelement.QuantityItem) {
                arrp[i] = true;
            } else {
                if (myproduct.QuantityItem - 1 <= 0) {
                    arrm[i] = true;
                } else {
                    arrq[i].quantity -= 1;
                    carty.map((cart, index) => {
                            if (cart.ItemName === myproduct.ItemName) {
                                carty[index].QuantityItem -= 1;
                            }
                        })
                    arrp[i] = false;
                    arrm[i] = false;

                }
            }
        }
    });
    sessionStorage.setItem("currentuser", JSON.stringify({ password: user.password, user_name: user.user_name, cart: carty, OrderID: user.OrderID }));
    setquantity(arrq);
    setOutOfStock(arrp);
    setBelowStock(arrm);
    window.location.reload();
}
async function removeItem(i, myproduct) {
    let curquantity = quantity;
    curquantity.splice(i, 1);
    setquantity(curquantity);
    let arr = JSON.parse(sessionStorage.getItem("currentuser"));
    let cartarr = arr.cart;
    cartarr.splice(i, 1);
    sessionStorage.setItem("currentuser", JSON.stringify({ password: arr.password, user_name: arr.user_name, cart: cartarr, OrderID: arr.OrderID }));
    setProducts(cartarr);
    let prod = await fetch(`http://localhost:3678/cart/deleteitem`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ myproduct: myproduct, orderid: arr.OrderID })
    });
    setOutOfStock(outOfStock);
    setBelowStock(belowStock);
    window.location.reload();
}
return (<div className="background-color-gray">
    <Client_Nav />
    {checkAtStart}
    <p className="title">shoping cart</p>
    <div className="grid2">
        {products.map((myproduct, index) => (
            <div key={index}>
                {console.log("myproduct: " + myproduct)}
                {console.log("index: " + index)}
                <section className="tpg">
                    <div className="sign-up-card">
                        <div className="form">
                            <div key={index}>
                                <br></br>
                                <p className="title2">{myproduct.ItemName}</p>
                                <img className="img" src={myproduct.path}></img>
                                <p className="title3">quantity: </p>
                                <div style={{ display: "block" }}>
                                    <p className="title3">{quantity[index].quantity}</p>
                                    {console.log(quantity[index].quantity)}
                                    <button className="toS" disabled={outOfStock[index]} onClick={() => { increaseQ(index, myproduct) }}>+</button>
                                    {console.log("outOfStock[index]: " + outOfStock[index])}
                                    <button className="toS" disabled={belowStock[index]} onClick={() => { reduceQ(index, myproduct) }}>-</button>
                                    {console.log("belowStock[index]: " + belowStock[index])}

                                    <button className="but2" onClick={() => { removeItem(index, myproduct) }}>remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        ))}
        {/* {products.map((myproduct, index) =>
            (
                <div key={index}>
                    <section className="tpg">
                        <div className="sign-up-card">
                            <div className="form">
                                <div key={index}>
                                    <br></br>
                                    <p className="title2">{myproduct.ItemName}</p>
                                    <img className="img" src={myproduct.path}></img>
                                    <p className="title3">quantity: </p>
                                    <div style={{ display: "block" }}>
                                        <p className="title3">{quantity[index].quantity}</p>
                                        {console.log(quantity[index].quantity)}
                                        <button className="toS" disabled={outOfStock[index]} onClick={() => { increaseQ(index, myproduct) }}>+</button>
                                        <button className="toS" disabled={belowStock[index]} onClick={() => { reduceQ(index, myproduct) }}>-</button>
                                        <button className="but2" onClick={() => { removeItem(index, myproduct) }}>remove</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            ))} */}
    </div>
    <button className="my-btn" onClick={forPaying}>PayMent</button>


</div>);

}