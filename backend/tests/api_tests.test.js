const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Note = require('../models/note');

beforeEach(async () => {
  await Note.deleteMany({});

  const noteObjects = helper.initialNotes.map((note) => new Note(note));
  const promiseArray = noteObjects.map((note) => note.save());
  await Promise.all(promiseArray);
});

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes');

    expect(response.body).toHaveLength(helper.initialNotes.length);
  });

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes');

    const contents = response.body.map((r) => r.content);

    expect(contents).toContain(
      'Browser can execute only Javascript',
    );
  });
})

describe('viewing a specific note', () => {
  test ('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb();

    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

    expect(resultNote.body).toEqual(processedNoteToView);
  });
});

describe('notes can be added', () => {
  test('a valid note can be added ', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    };

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

    const contents = notesAtEnd.map(n => n.content);
    expect(contents).toContain(
      'async/await simplifies making async calls',
    );
  });

  test('note without content is not added', async () => {
    const newNote = {
      important: true,
    };

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400);

    const notesAtEnd = await helper.notesInDb();

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
  });
});

describe('specific notes can be deleted', () => {
  test ('a note can be deleted', async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

    const contents = notesAtEnd.map((each) => each.content);
    expect(contents).not.toContain(noteToDelete.content);
  });
});

// users api tests

describe('when there is intially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('test', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeds with a fresh username', async () => {
    const usersBefore = await helper.usersInDb();
    
    const newUser = {
      username: 'sergii-test',
      name: 'Sergii Kirianov',
      password: 'secret',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAfter = await helper.usersInDb();
    expect(usersAfter).toHaveLength(usersBefore.length + 1);

    const usernames = usersAfter.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if trying to add user with same username', async () => {
    const usersBefore = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'secret',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` to be unique');

    const usersAfter = await helper.usersInDb();
    expect(usersAfter).toHaveLength(usersBefore.length);
  })
})

afterAll(() => {
  mongoose.connection.close();
});
