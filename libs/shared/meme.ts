import { randomInt } from 'crypto';

const kaomoji = [
  '(=^･ω･^=)',
  '(=^･ｪ･^=)',
  '( =ω=)..nyaa',
  '( ´(ｴ)ˋ )',
  '\tʕ •̀ o •́ ʔ',
  '/╲/\\( •̀ ω •́ )/\\╱\\',
  '\t/╲/\\╭[☉﹏☉]╮/\\╱\\',
  '(╮°-°)╮┳━━┳ ( ╯°□°)╯ ┻━━┻',
  '‿︵‿︵‿︵‿ヽ(°□° )ノ︵‿︵‿︵‿︵',
  '_(:3 」∠)_',
  '( ° ͜ʖ °)',
  '(╯°益°)╯彡┻━┻',
  '(◕‿◕✿)',
  '〜〜(／￣▽)／　〜ф',
  '(ಠ_ಠ)',
  '(￣^￣)ゞ',
  '└(＾＾)┐ ---> ┌(＾＾)┘ ---> └(＾＾)┐',
  '( ˘▽˘)っ♨',
  '(∩ᄑ_ᄑ)⊃━☆ﾟ*･｡*･:≡( ε:)',
  '(⊃｡•́‿•̀｡)⊃━✿✿✿✿✿✿',
  '\tQ(`⌒´Q)',
  '(งಠ_ಠ)ง　σ( •̀ ω •́ σ)',
];

export const magicLink = () => {
  const max = kaomoji.length;
  const randomNumber = randomInt(0, max);

  return kaomoji[randomNumber];
};
