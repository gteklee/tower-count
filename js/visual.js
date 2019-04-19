module.exports = {
    _loading: true, // Loading data
    _progress: 0, // Total loading progress
    _desc: '---', // Current process

    /**
     * Updates the progress bar with current
     * progress value while loading. 
     * 
     * @param {Float} val
     */
    updateProgress: function(val) {
        this.setProgress(val);
        // Update visual progress bar
        let perc = val + '%';
        //console.log(perc);
        $('#progress-bar-percent').text(perc);
        $('#progress-bar').css('width', perc);
    },

    /**
     * Updates both the visual and variable
     * loading state.
     * 
     * @param {Boolean} bool
     */
    updateLoadingState: function(bool) {
        this.setLoading(bool);
        // Update visual laoding state
        setTimeout(() => {
            $('#loading-container').removeClass('Loading').addClass('Hidden');
            $('#content-container').removeClass('Hidden').addClass('Content');
        }, 750);
    },

    /**
     * Update the visual description.
     * 
     * @param {String} desc 
     */
    updateProgressDescription: function(desc) {
        this.setDescription(desc);
        // Update visual description
        $('#progress-desc').text(desc);
    },

    // GETTERS / SETTERS

    /**
     * Set current loading progress. 
     * 
     * @param {Float} val
     */
    setProgress: function(val) {
        this._progress = val;
    },

    /**
     * Returns value of progress.
     */
    getProgress: function() {
        return this._progress;
    },

    /**
     * Set loading to true or false.
     * 
     * @param {Boolean} bool
     */
    setLoading: function(bool) {
        this._loading = bool;
    },

    /**
     * Returns current state of loading.
     */
    isLoading: function() {
        return this._loading;
    },

    /**
     * Returns current description of progress.
     */
    getDescription: function() {
        return this._desc;
    }, 

    /**
     * Set the description of progress.
     * 
     * @param {String} desc 
     */
    setDescription: function(desc) {
        this._desc = desc;
    }
};