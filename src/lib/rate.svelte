<script>

    const swap = () => {
    };
  
    const equal = () => {
    };

    const submit = () => {

    }

    const back = () => {

    }

    const forward = () => {}


  </script>
  
  <div class="flex flex-col md:flex-row justify-center items-center md:justify-between">

    <div class="flex flex-col items-center p-4 w-full md:w-1/3 rounded-lg bg-green-300">
        <h3 class="h3">BEST</h3>
        <img src="/1.PNG" alt="Image" class="w-full">
    </div>

    <div class="flex flex-col justify-center items-center">
        <button class="btn btn-primary mb-2" on:click={swap}>SWAP</button>
        <button class="btn btn-primary" on:click={equal}>EQUAL</button>
    </div>
    <div class="flex flex-col items-center p-4 w-full md:w-1/3 rounded-lg bg-red-300">
        <h3 class="h3">WORST</h3>
        <img src="/2.PNG" alt="Image" class="w-full">
    </div>
    

  </div>
  

  <nav class="flex justify-around items-center px-4 py-2 shadow-lg w-full ">
    <button class="btn btn-primary" on:click={back}>Back</button>
    <button class="btn btn-primary" on:click={submit}>Submit</button>
    <button class="btn btn-primary" on:click={forward}>Forward</button>
</nav>