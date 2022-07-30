import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import NavigationContext from "../../context/navigationContext";

type Props = {
    mobileBrowsingMode: boolean
}

export default function SearchBar({mobileBrowsingMode}: Props) {
    const {state, dispatch} = useContext(NavigationContext);



  const searchModeToggle = () => {
    dispatch({type: "TOGGLE_SEARCH_MODE"})
  };

  return (
    <div style={mobileBrowsingMode ? {flexGrow: "1"} : {}} className={`search-bar__container ${state.searchMode ? "" : "closed"}`}>
      {state.searchMode ? (
        <>
          <svg
            onClick={searchModeToggle}
            width={24}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 20"
          >
            <path
              className="back-icon"
              d="M1.5,10,10,18.5M1.5,10h21m-21,0L10,1.5"
            />
          </svg>
          <form className="search-bar__form">
            <input className="search-bar__input" type="search" />
          </form>
          <svg
            height={16}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
          >
            <path
              className="search-bar__exit-icon"
              d="M.2,1.14A.54.54,0,0,1,.05.92.7.7,0,0,1,0,.67.75.75,0,0,1,.05.41.51.51,0,0,1,.2.2.51.51,0,0,1,.41.05.75.75,0,0,1,.67,0,.7.7,0,0,1,.92.05.54.54,0,0,1,1.14.2L8,7.06,14.86.2a.54.54,0,0,1,.22-.15.7.7,0,0,1,.25,0,.75.75,0,0,1,.26.05A.51.51,0,0,1,15.8.2.51.51,0,0,1,16,.41.75.75,0,0,1,16,.67.7.7,0,0,1,16,.92a.54.54,0,0,1-.15.22L8.94,8l6.86,6.86a.54.54,0,0,1,.15.22.7.7,0,0,1,.05.25.75.75,0,0,1-.05.26.78.78,0,0,1-.36.36.75.75,0,0,1-.26.05.7.7,0,0,1-.25-.05.54.54,0,0,1-.22-.15L8,8.94,1.14,15.8A.54.54,0,0,1,.92,16,.7.7,0,0,1,.67,16,.75.75,0,0,1,.41,16,.51.51,0,0,1,.2,15.8a.51.51,0,0,1-.15-.21.75.75,0,0,1,0-.26.7.7,0,0,1,.05-.25.54.54,0,0,1,.15-.22L7.06,8Z"
            />
          </svg>
        </>
      ) : (
        getVariant(mobileBrowsingMode, searchModeToggle)
      )}
    </div>
  );
}

const getVariant = (mobileBrowsingMode: boolean, onClick: () => void) => {
    if (!mobileBrowsingMode) {
        return (
        <svg
          onClick={onClick}
          className="search-bar__icon-container"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            className="search-bar__icon"
            d="M23.45,20.8l-5.61-5.61a9.76,9.76,0,1,0-2.65,2.65l5.61,5.61a1.87,1.87,0,0,0,2.65-2.65ZM3.71,9.75a6,6,0,1,1,6,6,6,6,0,0,1-6-6Z"
          />
        </svg>
        )
    } else {
        return (
            <div onClick={onClick} className="search-bar__button">Search</div>
        )
    }
}
