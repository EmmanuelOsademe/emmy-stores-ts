import "./Home.css";
import { useContext } from "react";
import { Context } from "../../context/Context";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { SingleProduct } from "../../components/singleProduct/SingleProduct";
import { Product } from "../../../../backend/src/resources/product/product.model";

const Home: React.FC = () => {
    const {products, productFilterState: {byRating, byShipping, byStock, sort, searchQuery}} = useContext(Context);
    
    const transformProducts = () : Product[] => {
        let sortedProducts = products;

        if(sort){
            sortedProducts = sortedProducts.sort((a,b) => (
                sort === "Ascending" ? a.price - b.price : b.price - a.price
            ))
        }
        

        if(!byStock){
            sortedProducts = sortedProducts.filter((prod) => prod.currentStock > 0)
        }

        if(byShipping){
            sortedProducts = sortedProducts.filter((prod) => prod.freeShipping)
        }

        if(byRating){
            sortedProducts = sortedProducts.filter((prod) => prod.averageRating >= byRating)
        }
        
        if(searchQuery) {
            sortedProducts = sortedProducts.filter((prod) => prod.name.toLowerCase().includes(searchQuery.toLowerCase()))
        }
        return sortedProducts;
    }
    return (
        <div className="home">
            <Sidebar />
            <div className="products_container">
                {
                    transformProducts().map((prod) => {
                        return <SingleProduct prod={prod} key={String(prod._id)}/>
                    })
                }
            </div>
        </div>
    )
}

export default Home;