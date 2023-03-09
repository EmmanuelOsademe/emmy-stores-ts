import React from "react";
import "./App.css";
import {Routes, Route} from "react-router-dom";
import { Header } from "./components/header/Header";
import Home from "./pages/home/Home";
import { Cart } from "./pages/cart/Cart";


const App: React.FC = () => {
    return (
        <main>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />}/>
            </Routes>
        </main>
    )
}

export default App;