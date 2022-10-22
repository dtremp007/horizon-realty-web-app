import { getObjectPath } from ".";

const values = {
  name: 'John',
  age: 42,
  description: ['male', 'mid-age'],
  job: {
    title: 'Engineer',
    permissions: {
      admin: false,
      user: true,
    },
  },

  duties: [
    {
      title: 'Drink coffee',
      when: [{ morning: true }, { afternoon: false }, { evening: false }],
      info: {
        active: true,
        activity: [
          { date: 'yesterday', event: 'log' },
          { date: 'today', event: 'log' },
        ],
      },
    },
    {
      title: 'Do the job',
      when: [{ morning: false }, { afternoon: true }, { evening: false }],
      info: {
        active: true,
        activity: [
          { date: 'yesterday', event: 'log' },
          { date: 'today', event: 'log' },
        ],
      },
    },
  ],
};

describe('@mantine/form/get-path', () => {
  it('supports getting property from root', () => {
    expect(getObjectPath('name', values)).toBe('John');
    expect(getObjectPath('age', values)).toBe(42);
  });

  it('supports getting nested object property', () => {
    expect(getObjectPath('job.title', values)).toBe('Engineer');
    expect(getObjectPath('job.permissions', values)).toStrictEqual({ admin: false, user: true });
    expect(getObjectPath('job.permissions.user', values)).toBe(true);
  });

  it('supports getting array item', () => {
    expect(getObjectPath('description.0', values)).toBe('male');
    expect(getObjectPath('description.1', values)).toBe('mid-age');
  });

  it('supports getting property of an object nested in an array', () => {
    expect(getObjectPath('duties.0.title', values)).toBe('Drink coffee');
    expect(getObjectPath('duties.1.title', values)).toBe('Do the job');
  });

  it('supports multiple nesting', () => {
    expect(getObjectPath('duties.0.when.0.morning', values)).toBe(true);
    expect(getObjectPath('duties.1.info.activity.0.date', values)).toBe('yesterday');
  });

  it('returns undefined if path cannot be found', () => {
    expect(getObjectPath('random', values)).toBe(undefined);
    expect(getObjectPath('name.random.path', values)).toBe(undefined);
    expect(getObjectPath('duties.3.title', values)).toBe(undefined);
  });

  it('correctly handles undefined and null values', () => {
    expect(getObjectPath('a.b.c', undefined)).toBe(undefined);
    expect(getObjectPath('a.b.c', null)).toBe(undefined);
  });
});
