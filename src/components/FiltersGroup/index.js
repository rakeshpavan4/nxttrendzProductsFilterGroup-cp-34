import {BiSearch} from 'react-icons/bi'

import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    changeCategoryId,
    changeRatingId,
    changeSearch,
    clearFilters,
    ratingId,
    searchEnter,
  } = props

  const changeCategory = eachItem => {
    changeCategoryId(eachItem.categoryId)
  }

  const changeRating = eachItem => {
    changeRatingId(eachItem.ratingId)
  }
  const search = event => {
    changeSearch(event.target.value)
  }

  const keydown = event => {
    if (event.key === 'Enter') {
      searchEnter()
    }
  }

  return (
    <div className="filters-group-container">
      <div className="search-container">
        <input
          type="search"
          className="search"
          onChange={search}
          onKeyDown={keydown}
        />
        <BiSearch className="search-icon " />
      </div>
      <h1 className="category">Category</h1>
      <ul className="category-options-container">
        {categoryOptions.map(eachItem => (
          <li
            key={eachItem.categoryId}
            className="category-list-item"
            onClick={() => changeCategory(eachItem)}
          >
            <p className="category-button">{eachItem.name}</p>
          </li>
        ))}
      </ul>
      <h1 className="category">Rating</h1>
      <ul className="rating-container-list">
        {ratingsList.map(eachItem => (
          <li key={eachItem.ratingId} className="rating-list">
            <button
              type="button"
              className="filter-button"
              onClick={() => changeRating(eachItem)}
            >
              <img
                src={eachItem.imageUrl}
                alt={`rating ${eachItem.ratingId}`}
                className="filter-icon"
              />
            </button>
            <p
              className={`${
                eachItem.ratingId === ratingId ? 'up-color' : 'up'
              }`}
            >
              &up
            </p>
          </li>
        ))}
      </ul>
      <button type="button" className="clear-button" onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
