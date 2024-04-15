# Airbean backend
This API allows you to interact with a coffee shop's ordering system. Below you will find the relevant methods and endpoints. 
</br>

## /api/beans/menu
```
{
    "menu": [
        {
            "id": 1,
            "title": "Bryggkaffe",
            "desc": "Bryggd på månadens bönor.",
            "price": 39
        },
        {
            "id": 2,
            "title": "Caffè Doppio",
            "desc": "Bryggd på månadens bönor.",
            "price": 49
        },
        {
            "id": 3,
            "title": "Cappuccino",
            "desc": "Bryggd på månadens bönor.",
            "price": 49
        },
        {
            "id": 4,
            "title": "Latte Macchiato",
            "desc": "Bryggd på månadens bönor.",
            "price": 49
        },
        {
            "id": 5,
            "title": "Kaffe Latte",
            "desc": "Bryggd på månadens bönor.",
            "price": 54
        },
        {
            "id": 6,
            "title": "Cortado",
            "desc": "Bryggd på månadens bönor.",
            "price": 39
        }
    ]
}
```
This GET method is to get the menu. </br>The code above is the result of the method.
</br>
</br>

## /api/user/signup
```
{
    "userName": "Mark",
    "email": "mark@gmail.com",
    "password": "password123"
}
```
This POST method is to sign up.
</br>
</br>

## /api/user/login
```
{
    "userName": "Mark",
    "password": "password123"
}
```
```
{
    "email": "mark@gmail.com",
    "password": "password123"
}
```

This POST method is to Login in to a existing account.</br> Log in is only prohibited with either email and password or username and password.
</br>
</br>
## /api/beans/order
```
{
    "order": [
        {
            "title": "Bryggkaffe",
            "price": 39
        },
        {
            "title": "Cappuccino",
            "price": 49
        }
    ],
    "userId": "w0sd8o1CjG8oNHR0"
}
```
This POST method is to order. </br> Ordering requires an userId (_id) which you get from signing up.
</br>
</br>
## /api/user/orderhistory
```
{
    "message": "OrderHistory",
    "orders": [
        {
            "total": 88,
            "eta": 21,
            "_id": "0xHYoXn7VtlnFAFf"
        }
    ]
}
```
This POST method is to get order history for an user.</br> The code above is the result of the method.
</br>
</br>
## /api/user/:userId
```
{
    "userName": "Mark",
    "email": "gmail1",
    "password": 5566,
    "_id": "w0sd8o1CjG8oNHR0"
}
```
This GET method is to get user information with their userId (_id).</br> The code above is the result of the method.



