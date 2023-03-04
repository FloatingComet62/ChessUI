<script lang="ts">
  import { fileToInt, Piece, Player, type Color } from "../util";

  export let file: string;
  export let rank: string;
  export let color: Color;
  export let piece: Piece;
  export let moveable: boolean;
  export let setHP: (p: Piece, file: number, rank: number) => void;
  export let getHP: () => Piece;
  export let updateBoard: (move: string, piece: Piece, unChose: () => void) => void;
  export let moved: () => void

  let choosen = false;
  let highlighted = false;

  function unChose() {
    choosen = false;
  }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class={`cell ${highlighted ? 'highlight' : ''} ${choosen ? 'chosen': ''} ${color}`}
  unselectable="on"
  id={file+rank}
  on:click={()=> {
    if (!choosen && !moveable && getHP() != Piece.None) return;
    if (moveable) moved();

    if (piece == Piece.None) {
      // placing a piece on blank
      piece = getHP();
      setHP(Piece.None, fileToInt(file), parseInt(rank));
    } else {
      if (getHP() != Piece.None) {
        // capture
        piece = getHP();
        setHP(Piece.None, fileToInt(file), parseInt(rank));
      } else {
        setHP(piece, fileToInt(file), parseInt(rank));
        piece = Piece.None;
      }
    }
    if (getHP() != Piece.None)
      choosen = true;

    // Promotion check
    if (parseInt(rank) == 8 && piece == Piece.W_PAWN)
      piece = Piece.W_QUEEN;
    if (parseInt(rank) == 1 && piece == Piece.B_PAWN)
      piece = Piece.B_QUEEN;

    updateBoard(file+rank, piece, unChose);
  }}
  on:mouseup={(e)=> {
    if (e.button == 2) {
      highlighted = !highlighted;
    }
  }}
>
  <div unselectable="on" class="label">{file+rank}</div>
  {#if piece != Piece.None}
    <img unselectable="on" src={`/${piece}.png`} alt={piece} />
  {/if}
  {#if moveable}
    <div id="moveable_ball"></div>
  {/if}
</div>

<style>
.cell {
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
}
.label {
  position: absolute;
  opacity: 50%;
}
.light {
  background-color: #f0d9b5;
  color: #b58863;
}
.dark {
  background-color: #b58863;
  color: #f0d9b5;
}
.highlight {
  background-color: #e06853;
}
.chosen {
  background-color: #f7ec59;
}

#moveable_ball {
  position: absolute;
  align-self: center;
  width: 20px;
  height: 20px;
  background-color: rgba(48, 48, 48, 0.37);
  border-radius: 32rem;
}

img {
  place-self: center;
  width: 50px;
  height: 50px;
}
</style>