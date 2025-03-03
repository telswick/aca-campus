var _ = require('underscore');
var React = require('react');
var moment = require('moment');
var BaseModal = require('./BaseModal');
var CourseVideoUpload = require('./CourseVideoUpload');
require('react.backbone');

module.exports = React.createBackboneClass({
  getInitialState: function() {
    return {
      modalIsOpen: false
    };
  },

  componentDidUpdate: function() {
    Materialize.updateTextFields();
  },

  addGrade: function(e) {
    e.preventDefault();
    var gradeName = this.refs.grade.value;
    if (gradeName && this.getModel().get('grades').indexOf(gradeName) === -1) {
      this.getModel().get('grades').push(gradeName);
      this.getModel().save();
    }
    this.refs.grade.value = '';
  },

  removeGrade: function(e) {
    e.preventDefault();
    var gradeName = $(e.currentTarget).data('grade-name');
    var r = confirm('Are you sure you want to delete ' + gradeName + '?');
    if (r == true) {
      var gradeIdx = this.getModel().get('grades').indexOf(gradeName);
      this.getModel().get('grades').splice(gradeIdx, 1);
      this.getModel().get('registrations').each(function(student) {
        var gradeIdx = _.findIndex(student.get('grades'), function(grade) {
          return grade.courseId === this.getModel().id && grade.name === $(e.currentTarget).data('grade-name');
        }, this);
        student.get('grades').splice(gradeIdx, 1);
        student.save();
      }, this);
      this.getModel().save();
    }
  },

  focusGrade: function(e) {
    $(e.currentTarget).removeClass('disabled');
  },

  blurGrade: function(e) {
    e.persist();
    $(e.currentTarget).addClass('disabled');
    if ($(e.currentTarget).val()) {
      var student = this.getModel().get('registrations').get($(e.currentTarget).data('student-id'));
      var gradeIdx = _.findIndex(student.get('grades'), function(grade) {
        return grade.courseId === this.getModel().id && grade.name === $(e.currentTarget).data('grade-name');
      }, this);
      student.get('grades')[gradeIdx].score = Number($(e.currentTarget).val());
      student.save(null, {
        error: function() {
          e.target.value = '';
          student.get('grades')[gradeIdx].score = '';
        }
      });
    }
  },

  // I'm thinking how we show modals is in need of an update. Going into the dom
  // like this seems like an anti-pattern.  We would probably be better off
  // having some type of modal component and passing it a child component.
  // We would be less likely to run into weird bugs as a result of
  // repeating this logic over and over again
  //
  // <Modal> <CourseVideoUpload /> </Modal>
  showUploadModal: function() {
    this.setState({modalIsOpen: true});
  },

  closeModal: function() {
    this.setState({modalIsOpen: false});
  },

  removeVideo: function(e) {
    e.preventDefault();
    var r = confirm("You sure you wanna delete this video?");
    if (r === true) {
      var idx = $(e.currentTarget).data('idx');
      this.getModel().get('videos').splice(idx, 1);
      this.getModel().save();
    }

  },

  render: function() {
    var userRows = this.getModel().get('registrations').map(function(student, i) {
      return (
        <tr key={i}>
          <td className="right-align">
            <a href={'#users/' + student.id}>{student.fullName()}</a>
          </td>
        </tr>
      );
    });

    var gradeNames = _.map(this.getModel().get('grades'), function(grade, i) {
      this.getModel().get('registrations').each(function(student){
        if (!_.findWhere(student.get('grades'), { name: grade, courseId: this.getModel().id })) {
          student.get('grades').push({
            courseId: this.getModel().id,
            name: grade,
            score: ''
          });
        }
      }, this);

      return (
        <td key={i} style={{whiteSpace: 'nowrap'}} className="trim-padding">
        {grade} <a href="#" onClick={this.removeGrade} data-grade-name={grade}>x</a>
        </td>
      );
    }, this);

    var studentGrades = this.getModel().get('registrations').map(function(student, i) {
      var courseGrades = _.filter(student.get('grades'), function(grade) {
        return grade.courseId === this.getModel().id;
      }, this);

      var studentCells = _.map(courseGrades, function(grade, i) {
        return (
          <td key={i}>
            <input
            type="text"
            className="trim-margin disabled"
            style={{ height: '1rem' }}
            defaultValue={grade.score}
            onFocus={this.focusGrade}
            onBlur={this.blurGrade}
            data-student-id={student.id}
            data-grade-name={grade.name} />
          </td>
        );
      }, this);

      return (
        <tr key={i}>
        {studentCells}
        </tr>
      );
    }, this);

    var emails = this.getModel().get('registrations').map(function(student) {
      return student.get('username');
    });

    var videos = _.map(this.getModel().get('videos'), function(video, idx) {
      return (
        <p key={idx}><a href={video.link} target="_blank">{moment(video.timestamp, 'YYYY-MM-DD').format('ddd, MMM Do, YYYY')}</a> (<a href="#" data-idx={idx} onClick={this.removeVideo}>x</a>)</p>
      );
    }, this);

    return (
      <div>
        <div className="row">
          <div className="s12">
            <h3>{this.getModel().get('term').get('name') + ' - ' + this.getModel().get('name')}</h3>
            <div className="row">
                <div className="col s4">
                  <a href={'mailto:' + this.props.currentUser.get('username') + '?bcc=' + emails} className="waves-effect waves-teal btn" target="_blank">
                    <i className="material-icons left">mail</i> Email Class
                  </a>
                </div>
              <div className="col s4">
                <button
                  onClick={this.showUploadModal}
                  className="waves-effect waves-teal btn left">
                  <i className="fa fa-youtube-play left"></i> Add Video
                </button>
              </div>
              <div className="col s4">
                <a href={this.getModel().get('textbook')} target="_blank" className="waves-effect waves-teal btn left">
                  <i className="fa fa-book left"></i> Textbook
                </a>
              </div>
            </div>
            <div className="row">
              <div className="col s3">
                <table className="striped">
                  <thead>
                    <tr>
                      <th style={{ padding: '2rem 0 1.5rem' }}>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRows}
                  </tbody>
                </table>
              </div>
              <div className="col s9" style={{overflowX: 'scroll'}}>
                <table className="striped">
                  <thead>
                    <tr>
                      {gradeNames}
                      <th>
                        <div className="input-field trim-margin">
                          <input id="grade" type="text" ref="grade" onBlur={this.addGrade} className="trim-margin"/>
                          <label htmlFor="grade">Add Grade</label>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentGrades}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row">
              <div className="col s12 m6">
                <div className="card">

                  <div className="card-content">
                    <span className="card-title">Video Manager</span>
                    {videos}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BaseModal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          shouldCloseOnOverlayClick={false}>
          <CourseVideoUpload model={this.getModel()} />
        </BaseModal>
      </div>
    );
  }
});
