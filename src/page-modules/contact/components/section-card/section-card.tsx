import style from './section-card.module.css';
export const SectionCard = ({ children }: any) => {
  return <section className={style.container}>{children}</section>;
};

export default SectionCard;
