const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1234",
    database: "shoesShop"
});

connection.connect((err) => {
    if (err) {
        console.log("7err " + err);

    } else
        console.log('connected');
});
console.log("in cart");
// router.put('/cartUpdate', (req, res) => {
//     let orderid = req.body.OrderID;
//     const bodyData = req.body.update;
//     console.log(bodyData);
//     console.log("cartUpdate");
//     bodyData.forEach(element => {
//         connection.query(
//             `UPDATE shoesshop.itemsincart
//         SET CodeItem ="${element.CodeItem}",OrderID=${orderid},Quantity=${element.Quantity}
//         WHERE ItemInCartCode = ${element.ItemInCartCode}`, (err, rows) => {
//                 if (err)
//                     console.log("1err " + err);
//             }
//         );
//     });

//     res.send(true);
// })
router.put('/quantity', (req, res) => {
    const bodyData = req.body.quantity;
    console.log(bodyData);
    console.log("quantity");
    bodyData.forEach(element => {
        connection.query(
            `UPDATE shoesshop.itemsincart
        SET Quantity ="${element.quantity}"`

            , (err, rows) => {
                if (err)
                    console.log("2err " + err);
            }
        );
    });

    res.send(true);
})
router.post('/shopingCart', (req, res) => {
    console.log("req.body" + req.body.password);
    let sqlQuery = `select it.ItemName,it.CodeItem,it.QuantityItem,OrderID from itemsincart i
    join orders o on o.ordercode = i.orderid
    join items it on i.codeitem = it.CodeItem
    where o.customerid ="${req.body.password}" and Status = 0`;

    connection.query(sqlQuery, (err, result, fields) => {
        if (err) console.log("3err " + err);

        res.send(result);

    });
});
router.post("/insert", (req, res) => {
    const bodyData = req.body.post;
    let orderid = req.body.OrderID
    console.log("bodyData1 " + JSON.stringify(req.body));

    bodyData.forEach(element => {
        connection.query(
            `INSERT INTO itemsincart(CodeItem,OrderID,Quantity)  VALUES(${element.CodeItem},"${orderid}","${element.QuantityItem}")`, (err, rows) => {
                if (err)
                    console.log("4err " + "err");
                let p = `INSERT INTO itemsincart(CodeItem,OrderID,Quantity)  VALUES("${element.CodeItem}","${orderid}","${element.QuantityItem}")`;
                console.log(p);



            }
        );
    });
    res.send(true);
});
router.delete("/deleteitem", (req, res) => {
    let body = req.body.myproduct;
    console.log("body" + body);
    let sqlQuery = `DELETE FROM itemsincart WHERE CodeItem="${body.CodeItem}" AND OrderID="${req.body.orderid}"`;
    console.log(sqlQuery);
    connection.query(sqlQuery, (err, result, fields) => {
        if (err) {
            console.log("5err " + err);
            res.send(false);

        } else {
            console.log(result);
            res.send(result);
            return;
        }
    });
});
router.delete("/delete/allitem", (req, res) => {
    let body = req.body;
    console.log("body" + body);
    let sqlQuery = `DELETE FROM itemsincart WHERE OrderID="${body.orderid}"`;
    console.log(sqlQuery);
    connection.query(sqlQuery, (err, result, fields) => {
        if (err) {
            console.log("6err " + err);
            res.send(false);

        } else {
            console.log(result);
            res.send(result);
        }
    });
});

module.exports = router;