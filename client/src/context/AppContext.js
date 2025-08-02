import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  cvData: null,
  selectedTemplate: 'modern',
  customizations: {
    primaryColor: '#3b82f6',
    accentColor: '#1e40af',
    fontFamily: 'Inter',
  },
  webpageId: null,
  isLoading: false,
  error: null,
  templates: [],
};

// Action types
export const actionTypes = {
  SET_CV_DATA: 'SET_CV_DATA',
  SET_SELECTED_TEMPLATE: 'SET_SELECTED_TEMPLATE',
  SET_CUSTOMIZATIONS: 'SET_CUSTOMIZATIONS',
  SET_WEBPAGE_ID: 'SET_WEBPAGE_ID',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TEMPLATES: 'SET_TEMPLATES',
  UPDATE_CV_FIELD: 'UPDATE_CV_FIELD',
  ADD_CV_ITEM: 'ADD_CV_ITEM',
  REMOVE_CV_ITEM: 'REMOVE_CV_ITEM',
  RESET_STATE: 'RESET_STATE',
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_CV_DATA:
      return {
        ...state,
        cvData: action.payload,
        error: null,
      };

    case actionTypes.SET_SELECTED_TEMPLATE:
      return {
        ...state,
        selectedTemplate: action.payload,
      };

    case actionTypes.SET_CUSTOMIZATIONS:
      return {
        ...state,
        customizations: {
          ...state.customizations,
          ...action.payload,
        },
      };

    case actionTypes.SET_WEBPAGE_ID:
      return {
        ...state,
        webpageId: action.payload,
      };

    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case actionTypes.SET_TEMPLATES:
      return {
        ...state,
        templates: action.payload,
      };

    case actionTypes.UPDATE_CV_FIELD:
      return {
        ...state,
        cvData: {
          ...state.cvData,
          [action.payload.field]: action.payload.value,
        },
      };

    case actionTypes.ADD_CV_ITEM:
      const { section, item } = action.payload;
      return {
        ...state,
        cvData: {
          ...state.cvData,
          [section]: [...(state.cvData[section] || []), item],
        },
      };

    case actionTypes.REMOVE_CV_ITEM:
      const { section: removeSection, index } = action.payload;
      return {
        ...state,
        cvData: {
          ...state.cvData,
          [removeSection]: state.cvData[removeSection].filter((_, i) => i !== index),
        },
      };

    case actionTypes.RESET_STATE:
      return initialState;

    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = {
    setCVData: (data) => dispatch({ type: actionTypes.SET_CV_DATA, payload: data }),
    setSelectedTemplate: (template) => dispatch({ type: actionTypes.SET_SELECTED_TEMPLATE, payload: template }),
    setCustomizations: (customizations) => dispatch({ type: actionTypes.SET_CUSTOMIZATIONS, payload: customizations }),
    setWebpageId: (id) => dispatch({ type: actionTypes.SET_WEBPAGE_ID, payload: id }),
    setLoading: (loading) => dispatch({ type: actionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: actionTypes.SET_ERROR, payload: error }),
    setTemplates: (templates) => dispatch({ type: actionTypes.SET_TEMPLATES, payload: templates }),
    updateCVField: (field, value) => dispatch({ type: actionTypes.UPDATE_CV_FIELD, payload: { field, value } }),
    addCVItem: (section, item) => dispatch({ type: actionTypes.ADD_CV_ITEM, payload: { section, item } }),
    removeCVItem: (section, index) => dispatch({ type: actionTypes.REMOVE_CV_ITEM, payload: { section, index } }),
    resetState: () => dispatch({ type: actionTypes.RESET_STATE }),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;