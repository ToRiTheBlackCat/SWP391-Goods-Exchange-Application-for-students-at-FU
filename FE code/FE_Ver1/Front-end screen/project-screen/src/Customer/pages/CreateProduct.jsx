
import Navbar from '../components/Navbar.jsx';
import PostForm from '../components/CreateProduct/PostForm.jsx';

function CreateProduct(){
    return(
        <div className='CreateProduct'>
            <Navbar/>
            <PostForm/>
        </div>
    )
}

export default CreateProduct;