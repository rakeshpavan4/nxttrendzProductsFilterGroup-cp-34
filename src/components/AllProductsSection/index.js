import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const failureImg =
  'https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png'

const npProductsImg =
  'https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png'

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    categoryId: '',
    ratingId: '',
    searchValue: '',
    failure: false,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, categoryId, ratingId, searchValue} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${categoryId}&title_search=${searchValue}&rating=${ratingId}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
      })
    }
    if (response.status === 401) {
      this.setState({failure: true})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  changeCategoryId = id => {
    this.setState({categoryId: id}, this.getProducts)
  }

  changeRatingId = id => {
    this.setState({ratingId: id}, this.getProducts)
  }

  changeSearch = value => {
    this.setState({searchValue: value})
  }

  searchEnter = () => {
    this.getProducts()
  }

  failureView = () => (
    <div className="failure-view-container">
      <img src={failureImg} className="failure-img" alt="products failure" />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  clearFilters = () => {
    this.setState(
      {
        productsList: [],
        isLoading: false,
        activeOptionId: sortbyOptions[0].optionId,
        categoryId: '',
        ratingId: '',
        searchValue: '',
        failure: false,
      },
      this.getProducts,
    )
  }

  noProView = () => (
    <div className="no-products-container">
      <img src={npProductsImg} className="no-products-img" alt="no products" />
      <h1 className="no-products-heading">No Products Found</h1>
      <p className="no-products-description">
        We could not find any products. Try other filters.
      </p>
    </div>
  )

  productsView = () => {
    const {productsList, activeOptionId} = this.state
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderProductsList = () => {
    const {productsList, failure} = this.state
    // console.log(productsList.length)
    if (failure) {
      return this.failureView()
    }
    return (
      <>{productsList.length === 0 ? this.noProView() : this.productsView()}</>
    )

    // TODO: Add No Products View
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  render() {
    const {isLoading, ratingId} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          categoryChangeOption={this.categoryChangeOption}
          changeCategoryId={this.changeCategoryId}
          changeRatingId={this.changeRatingId}
          changeSearch={this.changeSearch}
          clearFilters={this.clearFilters}
          ratingId={ratingId}
          searchEnter={this.searchEnter}
        />

        {isLoading ? this.renderLoader() : this.renderProductsList()}
      </div>
    )
  }
}

export default AllProductsSection
