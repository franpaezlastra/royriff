// Fotos del local Roy Riff (Yerba Buena, Tucumán)
// Procesadas desde Fotos/local/Contenido-local-royriff/ — HEIC → webp 1400px long-edge, quality 82
// Cada item es compatible con la shape que espera GalleryTile de /pages/Galeria/components.
//
// Para agregar más fotos del local: dropeá el webp en ../../assets/local/ y agregá
// una entrada aquí con el import correspondiente.

import local01 from '../../assets/local/local-01.webp';
import local02 from '../../assets/local/local-02.webp';
import local03 from '../../assets/local/local-03.webp';
import local04 from '../../assets/local/local-04.webp';
import local05 from '../../assets/local/local-05.webp';
import local06 from '../../assets/local/local-06.webp';
import local07 from '../../assets/local/local-07.webp';
import local08 from '../../assets/local/local-08.webp';
import local09 from '../../assets/local/local-09.webp';
import local10 from '../../assets/local/local-10.webp';
import local11 from '../../assets/local/local-11.webp';
import local12 from '../../assets/local/local-12.webp';
import local13 from '../../assets/local/local-13.webp';
import local14 from '../../assets/local/local-14.webp';
import local15 from '../../assets/local/local-15.webp';
import local16 from '../../assets/local/local-16.webp';
import local17 from '../../assets/local/local-17.webp';
import local18 from '../../assets/local/local-18.webp';
import local19 from '../../assets/local/local-19.webp';
import local20 from '../../assets/local/local-20.webp';
import teamGroupImg from '../../assets/local/team.webp';

const makeItem = (id, src) => ({
  id,
  type: 'image',
  src,
  // title/caption/category intencionalmente vacíos: en /local la galería
  // es "sin etiquetas" — la foto habla sola. El GalleryTile respeta
  // ausencia de estos campos y no renderiza el bloque de metadata.
  title: '',
  caption: '',
});

export const LOCAL_PHOTOS = [
  makeItem('local-01', local01),
  makeItem('local-02', local02),
  makeItem('local-03', local03),
  makeItem('local-04', local04),
  makeItem('local-05', local05),
  makeItem('local-06', local06),
  makeItem('local-07', local07),
  makeItem('local-08', local08),
  makeItem('local-09', local09),
  makeItem('local-10', local10),
  makeItem('local-11', local11),
  makeItem('local-12', local12),
  makeItem('local-13', local13),
  makeItem('local-14', local14),
  makeItem('local-15', local15),
  makeItem('local-16', local16),
  makeItem('local-17', local17),
  makeItem('local-18', local18),
  makeItem('local-19', local19),
  makeItem('local-20', local20),
];

// Foto del equipo — RoyRiff-140 de la sesión de Noviembre 2026 (Verde Yerba Buena).
// Vive separada de LOCAL_PHOTOS porque es de otra producción y no debe aparecer en
// el masonry del local (que muestra solo Contenido-local-royriff).
export const TEAM_GROUP_PHOTO = {
  id: 'team-group-nov2026',
  type: 'image',
  src: teamGroupImg,
  title: '',
  caption: '',
};

export const getTeamGroupPhoto = () => TEAM_GROUP_PHOTO;
