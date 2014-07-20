import os
import json
import shutil

src = '/Users/gggritso/Projects/meatmonsters/monsters/'

for root, dirs, files in os.walk(src):

	for bot_name in dirs:
		bot_directory = os.path.join(root, bot_name)
		bot_files = os.listdir(bot_directory)

		bot_message_file = [f for f in bot_files if f.endswith('.txt')][0]

		with open(os.path.join(bot_directory, bot_message_file), 'rb') as f:
			bot_messages = [m for m in f.read().split('\n') if m]

		with open(os.path.join(bot_directory, 'attributes.json'), 'rb') as f:
			old_config = json.loads(f.read())

		triggers = []
		for trigger_set in old_config['actions'].values():
			triggers.extend(trigger_set)

		gifs = [f for f in bot_files if f.endswith('.gif')]

		new_config = {
			'fingerprint': bot_name,
			'messages': bot_messages,
			'gifs': gifs,
			'trigger': triggers
		}

		# make the folder for the gif!
		print bot_name
		os.makedirs(bot_name)
		with open(os.path.join(bot_name, 'bot.json'), 'wb') as f:
			f.write(json.dumps(new_config, indent=4))

		# copy the gifs!
		for gif_name in gifs:
			old_path = os.path.join(bot_directory, gif_name)
			new_path = os.path.join('.', bot_name, gif_name)

			shutil.copy2(old_path, new_path)
