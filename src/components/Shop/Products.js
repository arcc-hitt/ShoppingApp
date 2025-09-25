import { useDispatch, useSelector } from 'react-redux';
import { cartActions, sendCartData } from '../../store/cart-slice';
import { uiActions } from '../../store/ui-slice';
import ProductItem from './ProductItem';
import classes from './Products.module.css';

const DUMMY_PRODUCTS = [
  {
    id: 'p1',
    title: 'Test Product 1',
    price: 6,
    description: 'This is a first product - amazing!',
  },
  {
    id: 'p2',
    title: 'Test Product 2',
    price: 10,
    description: 'This is a second product - fantastic!',
  },
];

const Products = (props) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const addToCartHandler = (product) => {
    dispatch(cartActions.addItem(product));
    dispatch(sendCartData());
  };

  return (
    <section className={classes.products}>
      <h2>Buy your favorite products</h2>
      <ul>
        {DUMMY_PRODUCTS.map((product) => (
          <ProductItem
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            description={product.description}
            onAddToCart={addToCartHandler}
          />
        ))}
      </ul>
    </section>
  );
};

export default Products;
