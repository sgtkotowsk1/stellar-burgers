import { FC, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useAppSelector } from '../../services/store';

import { redirect, useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../modal';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    redirect('/');
    return null;
  }

  const { ingredients, error, isLoading } = useAppSelector(
    (state) => state.ingredients
  );

  const ingredientData = ingredients.find((item) => item._id === id);

  const [isImageLoaded, setImageLoaded] = useState(false);

  if (!ingredientData) {
    return <Preloader />;
  }

  if (error) {
    return <p>Ингредиент не найден</p>;
  }

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <>
      {(!isImageLoaded || isLoading) && <Preloader />}
      <IngredientDetailsUI
        ingredientData={ingredientData}
        onImageLoad={() => setImageLoaded(true)}
      />
    </>
  );
};
