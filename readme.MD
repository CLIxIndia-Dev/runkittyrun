rkr

how to play
https://docs.google.com/document/d/136Q4hVcT7vchvDaSMgIWJx8KpbK6ZL0EpbrX7LVOJzI/edit#
In Run Kitty Run, you (the player) are training a cat to be the best mouse catcher. The cat catches the mouse by crossing the finish line at the same time as the mouse



levels




query params
api
lang

constructor() {
        this.uuid = this.getCookie('session_uuid');
        this.params = new URLSearchParams(location.search)
        this.api = (this.params.get('api') || '/api/v1/logging/genericlog')
    }

    submitData(data) {
        var xhr = new XMLHttpRequest();

        // This part gets unplatform's session uuid if available
        // and creates a json string for the ajax POST. The /appdata/ api
        // is pretty flexible for the params field. Timestamps are generated
        // server-side & don't need to be included.
        var data_string = {}

        // if you want to test with a session id, you can set
        // document.cookie = "session_uuid=test"
        data_string['session_id'] = this.uuid;


        for (var key in data) { data_string[key] = data[key]; };

        var qbank = { data: data_string }
        qbank = JSON.stringify(qbank);

        xhr.open('POST', this.api, true); // True means async
        xhr.setRequestHeader("x-api-proxy", this.uuid)
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(qbank);
        if (xhr.response != 200) {
            //            xhr.close()
            var xhr = new XMLHttpRequest();
            var unplatform = JSON.stringify(data_string);
            xhr.open('POST', '/api/appdata/', true); // True means async
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(unplatform);