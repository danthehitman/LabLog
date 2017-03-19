define(['ko', 'llapi'],
    function (ko, llapi) {
        return function fileUploadViewModel() {
            var self = this;
            self.llapi = llapi;

            self.uploadClick = function () {
                var fileUpload = $("#files").get(0);
                var files = fileUpload.files;
                var data = new FormData();
                for (var i = 0; i < files.length; i++) {
                    data.append(files[i].name, files[i]);
                }
                data.append("name", $("#imageName").val());
                data.append("description", $("#imageDescription").val());
                data.append("tags", $("#imageTags").val());
                self.llapi.uploadFiles(data,
                    function (message) {
                        alert(message);
                    },
                    function () {
                        alert("There was error uploading files!");
                    }
                );
            };
            
        };
    });