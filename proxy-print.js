console.log("hello World!")

document.getElementById("card-upload").addEventListener('change', upload);



function upload(e) {
    const file = e.target.files[0];

    if (FileReader) {
        console.log("hello!");
        let fr = new FileReader();
        fr.onload = function () {
            document.getElementById("test").src = fr.result;
        };
        fr.readAsDataURL( file );
    };

    // document.getElementById("test").src = file;

}