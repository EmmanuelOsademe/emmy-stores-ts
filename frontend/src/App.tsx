import React from "react";
import "./App.css";
import {Routes, Route} from "react-router-dom";
import { Header } from "./components/header/Header";
import Home from "./pages/home/Home";
import { Cart } from "./pages/cart/Cart";
import { Register } from "./pages/register/Register";
import { Login } from "./pages/login/Login";
import { Payment } from "./pages/payment/Payment";
import { PaymentCompletion } from "./pages/payment-completion/PaymentCompletion";
import { AdminHome } from "./pages/adminHome/AdminHome";
import { AdminSales } from "./pages/adminSales/AdminSales";
import { AdminProducts } from "./pages/adminProducts/AdminProducts";


const App: React.FC = () => {
    return (
        <main>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/login" element={<Login />} />
                <Route path="/payment" element={<Payment />}/>
                <Route path="/payment-completion" element={<PaymentCompletion />} />
                <Route path="/admin-home" element={<AdminHome />}/>
                <Route path="/admin-sales" element={<AdminSales />}/>
                <Route path='/admin-products' element={<AdminProducts />} />
            </Routes>
        </main>
    )
}

export default App;