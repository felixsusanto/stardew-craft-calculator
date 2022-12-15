import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import '../assets/craftablesSprite/texture.css';
import '../assets/materialSprite/texture.css';

const CraftableSpriteWrapper = styled.div<Pick<CSProps, 'scale'>>`
  display: inline-block;
  position: relative;
  line-height: 0;
  .cs {
    transform: scale(${p => p.scale ||1 });
    transform-origin: top left;
    image-rendering: pixelated;
  }
`;

type CSProps = {
  id: string;
  scale?: number;
  style?: CSSProperties;
}

const SpriteFactory = (prefix: string): React.FC<CSProps> => (props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [h, setH] = React.useState<number>();
  const [w, setW] = React.useState<number>();
  React.useEffect(() => {
    const sprite = ref.current;
    if (!sprite) return;
    const scale = props.scale || 1;
    const height = sprite.clientHeight * scale;
    const width = sprite.clientWidth * scale;
    setH(height);
    setW(width);
  }, []);
  const {id, style, ...rest} = props;
  return (
    <CraftableSpriteWrapper {...rest} style={{...style, height: h, width: w}}>
      <div className={`${prefix}${id}`} ref={ref}/>
    </CraftableSpriteWrapper>
  );
};

const CraftableSprite: React.FC<CSProps> = SpriteFactory('cs c-');
export const MaterialSprite: React.FC<CSProps> = SpriteFactory('ms m-');


export default CraftableSprite;
