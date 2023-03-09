import "./Home.css";
import { useContext } from "react";
import { Context } from "../../context/Context";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { SingleProduct } from "../../components/singleProduct/SingleProduct";

const Home: React.FC = () => {
    const {products} = useContext(Context);

    return (
        <div className="home">
            <Sidebar />
            <div className="products_container">
                {
                    products.map((prod) => {
                        return <SingleProduct prod={prod} key={prod._id}/>
                    })
                }
            </div>
        </div>
    )
}

export default Home;