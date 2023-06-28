import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import My_Manager from "./My_Manager";
import Nav from "./Nav"
import Manager_Update_Product from "./Manager_Update_Product"
import '../App.css';
export default function Manager_Product_List(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [client, setClient] = useState([]);
    const [category, setCategory] = useState("");
    const [mystyle, setMystyle] = useState({});
    const [categories, setCategories] = useState([]);
    const [limit, setLimit] = useState(-10);
    const [displayB, setDisplayB] = useState("block");
    const [displayP, setDisplayP] = useState("none");
    let a = 0
    
    
    
    async function getProducts(a) {
        let newLimit = limit + 10;
        setLimit(newLimit)
        console.log("newLimit" + newLimit);
        let prod = await fetch(`http://localhost:3678/products/limit`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ limit: newLimit })
        });
        let pro = await prod.json();
        let arr = products;
        if (a === 1) {
            if (pro.length == 0) {
                setDisplayB("none")
                setDisplayP("block")
            }
            else {

                let i = 0;
                while (i != pro.length) {
                    debugger;
                    arr.push(pro[i]);
                    i++;
                }

                setProducts([...arr]);
            }
        }
    }
    useEffect(() => {
        a++;
        getcategories();
        getProducts(a);
    }, []);
    async function delete_item(code) {
        let produc = await fetch(`http://localhost:3678/products/item/name`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ OrderID: code })
      
        });
        let mypro = await produc.json();
        if (mypro) {
            let prod = await fetch(`http://localhost:3678/products/${code}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            let pro = await prod.json();
        } else {
            alert("cannot delete item.item is Ordered by client and still not delivered");
        }

        getProducts(1);
    }
    async function categoryType(val) {
        setCategory(val);
        console.log(`val ${val}`);

        let catItems = await fetch(`http://localhost:3678/products/codecategory/${val}`, {
            method: 'GET'
        });
        let allCatItems = await catItems.json();
        console.log(allCatItems);
        setProducts(allCatItems);
    };
    async function getcategories() {
        let categor = await fetch(`http://localhost:3678/products/allcategories`, {
            method: 'GET'
        });
        let allCategorItems = await categor.json();
        setCategories(allCategorItems);
    }
    async function updating_item(code) {
        let categor = await fetch(`http://localhost:3678/products/itemdetails/${code}`, {
            method: 'GET'
        });
        let allCategorItems = await categor.json();
        navigate("/manager/currentProduct", { state: { currentProduct: allCategorItems, categories: categories } });
    }
    if (categories.length > 0) {
        return (
            <div>
                <Nav />
                <p className="title4">all items</p>
                <br></br>
                <label className="title3">categories: </label>
                <div className="allS">
                    <div className="select">
                        <select onChange={(e) => { categoryType(e.target.value) }} >
                            {categories.map((option, index) => (
                                <option key={option.CategoryCode} value={index + 1}>
                                   {option.CategoryName}
                                </option>
                            ))}
                        </select>
                       </div>
                       </div>
                        <br />{products.map((myproduct) =>
                            (<div className="box3" key={myproduct.ItemName}>
                                <p className="title3">{myproduct.ItemName}</p>
                                <button className="but" onClick={() => { delete_item(myproduct.CodeItem) }}>delete</button>
                                <button className="but" onClick={() => { updating_item(myproduct.CodeItem) }}>updating</button>
                            </div>)
                        )}
                         <button className="but2" style={{ display: displayB }} onClick={() => { getProducts(1) }}>Show more</button>
        <p style={{ display: displayP, color: "black" }}>no more products</p>
                    </div>  )
    }
}